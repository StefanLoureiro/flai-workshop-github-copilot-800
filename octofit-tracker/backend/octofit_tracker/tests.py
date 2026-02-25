from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Tony Stark',
            email='tony@avengers.com',
            password='ironman123'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Tony Stark')
        self.assertEqual(self.user.email, 'tony@avengers.com')

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Tony Stark')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=['tony@avengers.com', 'steve@avengers.com']
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Team Marvel')

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='tony@avengers.com',
            activity_type='Running',
            duration=30.0,
            date=date(2024, 1, 10)
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.activity_type, 'Running')
        self.assertEqual(self.activity.duration, 30.0)

    def test_activity_str(self):
        self.assertIn('Running', str(self.activity))


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user='Tony Stark',
            score=950
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.user, 'Tony Stark')
        self.assertEqual(self.entry.score, 950)

    def test_leaderboard_str(self):
        self.assertIn('Tony Stark', str(self.entry))


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Iron Man Cardio Blast',
            description='High intensity interval training.',
            duration=30.0
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Iron Man Cardio Blast')
        self.assertEqual(self.workout.duration, 30.0)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Iron Man Cardio Blast')


class APIEndpointTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        User.objects.create(name='Tony Stark', email='tony@avengers.com', password='ironman123')
        Team.objects.create(name='Team Marvel', members=['tony@avengers.com'])
        Activity.objects.create(user='tony@avengers.com', activity_type='Running', duration=30.0, date=date(2024, 1, 10))
        Leaderboard.objects.create(user='Tony Stark', score=950)
        Workout.objects.create(name='Iron Man Cardio Blast', description='HIIT training.', duration=30.0)

    def test_users_endpoint(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_teams_endpoint(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_activities_endpoint(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leaderboard_endpoint(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_workouts_endpoint(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_root_redirects_to_api(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
