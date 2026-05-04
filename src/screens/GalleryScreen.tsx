import { useQuery } from '@apollo/client/react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CHARACTERS_QUERY } from '../graphql/queries';
import type { CharactersQueryData } from '../graphql/types';
import type { RootStackParamList } from '../navigation/types';
import type { GalleryImage } from '../types/gallery';
import { setError, setImages, setLoading, toggleLike } from '../store/gallerySlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { DeviceDetailsCard } from '../components/DeviceDetailsCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

const PAGE = 1;
const GAP = 10;
const columns = 2;
const screenW = Dimensions.get('window').width;
const tileW = (screenW - GAP * (columns + 1)) / columns;

type CharacterNode = {
  id: string;
  name: string;
  image: string;
  species: string;
  episode: { id: string }[];
};

function mapToGalleryImage(c: CharacterNode): GalleryImage {
  return {
    id: c.id,
    imageUrl: c.image,
    title: c.name,
    author: c.species,
    baseLikes: c.episode?.length ?? 0,
  };
}

export function GalleryScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { images, likedByUser, error } = useAppSelector(s => s.gallery);
  const user = useAppSelector(s => s.auth.user);

  const { data, loading: apolloLoading, error: apolloError, refetch } =
    useQuery<CharactersQueryData>(CHARACTERS_QUERY, {
      variables: { page: PAGE },
    });

  useEffect(() => {
    dispatch(setLoading(apolloLoading));
  }, [apolloLoading, dispatch]);

  useEffect(() => {
    dispatch(setError(apolloError ? apolloError.message : null));
  }, [apolloError, dispatch]);

  useEffect(() => {
    const results = data?.characters?.results ?? undefined;
    if (results?.length) {
      dispatch(setImages(results.map(mapToGalleryImage)));
    }
  }, [data, dispatch]);

  const onRefresh = useCallback(() => {
    refetch({ page: PAGE }).catch(() => {});
  }, [refetch]);

  const refreshing = apolloLoading && images.length > 0;

  const listHeader = useMemo(
    () => (
      <View style={styles.headerBlock}>
        <Text style={styles.welcome}>
          {user ? `Hi, ${user.name}` : 'Gallery'}
        </Text>
        <Text style={styles.hint}>Pull down to refresh · Tap a card for details</Text>
        <DeviceDetailsCard />
      </View>
    ),
    [user],
  );

  const renderItem = useCallback(
    ({ item }: { item: GalleryImage }) => {
      const liked = Boolean(likedByUser[item.id]);
      const likes = item.baseLikes + (liked ? 1 : 0);
      return (
        <View style={[styles.tileWrap, { width: tileW }]}>
          <Pressable
            onPress={() =>
              navigation.navigate('ImageDetail', { characterId: item.id })
            }
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.title}`}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.tileMeta}>
              <Text numberOfLines={1} style={styles.tileTitle}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.tileAuthor}>
                {item.author}
              </Text>
              <View style={styles.likeRow}>
                <Pressable
                  hitSlop={8}
                  onPress={() => dispatch(toggleLike(item.id))}
                  accessibilityRole="button"
                  accessibilityLabel={liked ? 'Unlike' : 'Like'}>
                  <Text style={styles.heart}>{liked ? '♥' : '♡'}</Text>
                </Pressable>
                <Text style={styles.likes}>{likes}</Text>
              </View>
            </View>
          </Pressable>
        </View>
      );
    },
    [dispatch, likedByUser, navigation],
  );

  const empty = !apolloLoading && images.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {apolloLoading && images.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0a84ff" />
          <Text style={styles.loadingText}>Loading images…</Text>
        </View>
      ) : null}
      {error != null && images.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Could not load gallery</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <Pressable onPress={onRefresh} style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}
      <FlatList
        data={images}
        keyExtractor={item => item.id}
        numColumns={columns}
        ListHeaderComponent={listHeader}
        columnWrapperStyle={styles.rowWrap}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        removeClippedSubviews={Platform.OS === 'android'}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          empty ? (
            <Text style={styles.empty}>No characters to show.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContent: {
    paddingBottom: 24,
  },
  headerBlock: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  welcome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  hint: {
    color: '#8e8e93',
    fontSize: 13,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  rowWrap: {
    paddingHorizontal: GAP,
    gap: GAP,
    marginBottom: GAP,
  },
  tileWrap: {},
  tile: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tilePressed: {
    opacity: 0.92,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#2c2c2e',
  },
  tileMeta: {
    padding: 10,
  },
  tileTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tileAuthor: {
    color: '#aeaeb2',
    fontSize: 12,
    marginTop: 2,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  heart: {
    color: '#ff375f',
    fontSize: 18,
  },
  likes: {
    color: '#f2f2f7',
    fontSize: 13,
    fontWeight: '500',
  },
  center: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 1,
    backgroundColor: '#000000cc',
  },
  loadingText: {
    color: '#aeaeb2',
    marginTop: 12,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBody: {
    color: '#ff6961',
    marginTop: 8,
    textAlign: 'center',
  },
  retry: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0a84ff',
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#8e8e93',
    marginTop: 24,
  },
});
