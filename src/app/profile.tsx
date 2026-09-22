import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { theme } from '../constants/theme';
import { formatCurrency } from '../utils/currency';

export default function ProfileScreen() {
  const router = useRouter();

  const achievements = [
    { icon: '🏆', title: 'First Empire' },
    { icon: '💰', title: 'Millionaire' },
    { icon: '🏙', title: 'City Builder' },
    { icon: '🤝', title: 'Master Trader' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Button
            title="BACK"
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Typography variant="h2" weight="bold" color="primary">
            PROFILE
          </Typography>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge} />
          <Typography variant="h1" weight="bold" style={styles.name}>Mohit</Typography>
          <Typography variant="h3" color="accent">Level 12</Typography>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <Typography variant="body" color="textLight">Net Worth</Typography>
            <Typography variant="h2" weight="bold" color="success">
              {formatCurrency(24500)}
            </Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Typography variant="h2" weight="bold">42</Typography>
              <Typography variant="caption" color="textLight">Games Played</Typography>
            </View>
            <View style={styles.statBox}>
              <Typography variant="h2" weight="bold">24</Typography>
              <Typography variant="caption" color="textLight">Wins</Typography>
            </View>
            <View style={styles.statBox}>
              <Typography variant="h2" weight="bold">186</Typography>
              <Typography variant="caption" color="textLight">Properties</Typography>
            </View>
          </View>
        </Card>

        <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
          Achievements
        </Typography>

        <View style={styles.achievementsContainer}>
          {achievements.map((ach, index) => (
            <Card key={index} style={styles.achievementCard} variant="outlined">
              <Typography variant="h1" align="center">{ach.icon}</Typography>
              <Typography variant="caption" weight="bold" align="center" style={styles.achievementTitle}>
                {ach.title}
              </Typography>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 80,
  },
  headerRight: {
    width: 80,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.accent,
    marginBottom: theme.spacing.md,
  },
  name: {
    marginBottom: theme.spacing.xs,
  },
  statsCard: {
    marginBottom: theme.spacing.xxl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    marginBottom: theme.spacing.lg,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  achievementTitle: {
    marginTop: theme.spacing.sm,
  },
});
