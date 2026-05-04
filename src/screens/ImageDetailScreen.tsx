import { useQuery } from '@apollo/client/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CHARACTER_QUERY } from '../graphql/queries';
import type { CharacterQueryData } from '../graphql/types';
import type { RootStackParamList } from '../navigation/types';
import { toggleLike } from '../store/gallerySlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetail'>;

type CharacterData = NonNullable<CharacterQueryData['character']>;

function buildDescription(c: CharacterData): string {
  const lines = [
    `${c.name} is a ${c.species}, currently ${c.status.toLowerCase()}.`,
    `Gender: ${c.gender}.`,
  ];
  if (c.type?.trim()) {
    lines.push(`Subtype: ${c.type}.`);
  }
  lines.push(`Origin: ${c.origin?.name ?? 'Unknown'}.`);
  lines.push(`Last known location: ${c.location?.name ?? 'Unknown'}.`);
  return lines.join('\n\n');
}

export function ImageDetailScreen({ route }: Props) {
  const { characterId } = route.params;
  const dispatch = useAppDispatch();
  const likedByUser = useAppSelector(s => s.gallery.likedByUser);

  const { data, loading, error } = useQuery<CharacterQueryData>(
    CHARACTER_QUERY,
    {
      variables: { id: characterId },
    },
  );

  const character = data?.character ?? undefined;
  const baseLikes = character?.episode?.length ?? 0;
  const userLiked = Boolean(likedByUser[characterId]);
  const totalLikes = baseLikes + (userLiked ? 1 : 0);

  const heroScale = useSharedValue(0.88);
  const heroOpacity = useSharedValue(0);
  const burst = useSharedValue(0);
  const likeIconScale = useSharedValue(1);

  useEffect(() => {
    heroScale.value = withSpring(1, { damping: 16, stiffness: 160 });
    heroOpacity.value = withTiming(1, { duration: 400 });
  }, [character?.id, heroOpacity, heroScale]);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ scale: heroScale.value }],
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value,
    transform: [{ scale: 0.5 + burst.value * 1.1 }],
  }));

  const likeIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeIconScale.value }],
  }));

  const playBurst = useCallback(() => {
    burst.value = 0;
    burst.value = withSequence(
      withTiming(1, { duration: 140 }),
      withTiming(0, { duration: 560 }),
    );
  }, [burst]);

  const onLike = useCallback(() => {
    dispatch(toggleLike(characterId));
    likeIconScale.value = withSequence(
      withSpring(1.35, { damping: 8, stiffness: 220 }),
      withSpring(1, { damping: 12, stiffness: 180 }),
    );
    playBurst();
  }, [characterId, dispatch, likeIconScale, playBurst]);

  const description = useMemo(
    () => (character ? buildDescription(character) : ''),
    [character],
  );

  if (loading && !character) {
    return (
      <SafeAreaView style={styles.centerSafe} edges={['bottom']}>
        <ActivityIndicator size="large" color="#0a84ff" />
      </SafeAreaView>
    );
  }

  if (error || !character) {
    return (
      <SafeAreaView style={styles.centerSafe} edges={['bottom']}>
        <Text style={styles.errorText}>
          {error?.message ?? 'Character not found.'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroWrap}>
          <Animated.View style={[styles.heroInner, heroAnimatedStyle]}>
            <Image
              source={{ uri: character.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <Animated.Text style={[styles.burstHeart, burstStyle]}>
              ♥
            </Animated.Text>
          </Animated.View>
        </View>

        <Text style={styles.title}>{character.name}</Text>
        <Text style={styles.author}>by {character.species}</Text>

        <View style={styles.likeBar}>
          <Pressable
            onPress={onLike}
            style={({ pressed }) => [styles.likeBtn, pressed && styles.likeBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Like or unlike">
            <Animated.Text style={[styles.likeIcon, likeIconStyle]}>
              {userLiked ? '♥' : '♡'}
            </Animated.Text>
          </Pressable>
          <Text style={styles.likeCount}>{totalLikes} likes</Text>
        </View>

        <Text style={styles.section}>Description</Text>
        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerSafe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scroll: {
    paddingBottom: 32,
  },
  heroWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroInner: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1c1c1e',
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1,
  },
  burstHeart: {
    position: 'absolute',
    alignSelf: 'center',
    top: '38%',
    fontSize: 72,
    color: '#ff375f',
    textShadowColor: '#00000088',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  author: {
    color: '#aeaeb2',
    fontSize: 15,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  likeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  likeBtn: {
    padding: 8,
  },
  likeBtnPressed: {
    opacity: 0.85,
  },
  likeIcon: {
    fontSize: 32,
    color: '#ff375f',
  },
  likeCount: {
    color: '#f2f2f7',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    marginTop: 8,
    paddingHorizontal: 16,
    color: '#d1d1d6',
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: '#ff6961',
    padding: 24,
    textAlign: 'center',
  },
});
