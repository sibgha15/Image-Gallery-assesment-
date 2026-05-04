import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { DeviceDetailsPayload } from '../native/DeviceDetails';
import { fetchDeviceDetails } from '../native/DeviceDetails';

export function DeviceDetailsCard() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<DeviceDetailsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchDeviceDetails();
      setDetails(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load device info');
    } finally {
      setLoading(false);
    }
  }, []);

  const onToggle = useCallback(() => {
    if (!open) {
      setOpen(true);
      load().catch(() => {});
    } else {
      setOpen(false);
    }
  }, [load, open]);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        accessibilityRole="button"
        accessibilityLabel="Toggle device details from native bridge">
        <Text style={styles.headerTitle}>Device (native bridge)</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open && (
        <View style={styles.body}>
          {loading && <ActivityIndicator />}
          {error != null && <Text style={styles.error}>{error}</Text>}
          {details != null && !loading && (
            <>
              <Row label="Brand" value={details.brand} />
              <Row label="Manufacturer" value={details.manufacturer ?? '—'} />
              <Row label="Model" value={details.model} />
              {details.device != null && (
                <Row label="Device" value={details.device} />
              )}
              {details.product != null && (
                <Row label="Product" value={details.product} />
              )}
              <Row label="OS version" value={details.systemVersion} />
              {details.sdkInt != null && (
                <Row label="SDK" value={String(details.sdkInt)} />
              )}
              {details.name != null && (
                <Row label="Device name" value={details.name} />
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#1c1c1e',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  headerPressed: {
    opacity: 0.85,
  },
  headerTitle: {
    color: '#f2f2f7',
    fontSize: 15,
    fontWeight: '600',
  },
  chevron: {
    color: '#8e8e93',
    fontSize: 12,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    color: '#8e8e93',
    fontSize: 13,
  },
  rowValue: {
    color: '#f2f2f7',
    fontSize: 13,
    flexShrink: 1,
    textAlign: 'right',
    flex: 1,
  },
  error: {
    color: '#ff453a',
    fontSize: 13,
  },
});
