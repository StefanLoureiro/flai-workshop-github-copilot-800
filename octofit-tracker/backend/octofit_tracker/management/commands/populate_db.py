from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Cleared existing data.')

        # Create users (superheroes)
        users = [
            User(name='Tony Stark', email='tony@avengers.com', password='ironman123'),
            User(name='Steve Rogers', email='steve@avengers.com', password='shield456'),
            User(name='Natasha Romanoff', email='natasha@avengers.com', password='blackwidow789'),
            User(name='Bruce Wayne', email='bruce@dcheroes.com', password='batman123'),
            User(name='Clark Kent', email='clark@dcheroes.com', password='superman456'),
            User(name='Diana Prince', email='diana@dcheroes.com', password='wonderwoman789'),
        ]
        for user in users:
            user.save()
        self.stdout.write(f'Created {len(users)} users.')

        # Create teams
        team_marvel = Team(
            name='Team Marvel',
            members=['tony@avengers.com', 'steve@avengers.com', 'natasha@avengers.com']
        )
        team_marvel.save()

        team_dc = Team(
            name='Team DC',
            members=['bruce@dcheroes.com', 'clark@dcheroes.com', 'diana@dcheroes.com']
        )
        team_dc.save()
        self.stdout.write('Created 2 teams (Team Marvel, Team DC).')

        # Create activities
        activities = [
            Activity(user='tony@avengers.com', activity_type='Running', duration=30.0, date=date(2024, 1, 10)),
            Activity(user='tony@avengers.com', activity_type='Cycling', duration=45.0, date=date(2024, 1, 11)),
            Activity(user='steve@avengers.com', activity_type='Weight Training', duration=60.0, date=date(2024, 1, 10)),
            Activity(user='natasha@avengers.com', activity_type='Yoga', duration=50.0, date=date(2024, 1, 12)),
            Activity(user='bruce@dcheroes.com', activity_type='Martial Arts', duration=90.0, date=date(2024, 1, 10)),
            Activity(user='clark@dcheroes.com', activity_type='Running', duration=20.0, date=date(2024, 1, 11)),
            Activity(user='diana@dcheroes.com', activity_type='Sword Training', duration=75.0, date=date(2024, 1, 12)),
        ]
        for activity in activities:
            activity.save()
        self.stdout.write(f'Created {len(activities)} activities.')

        # Create leaderboard
        leaderboard_entries = [
            Leaderboard(user='Tony Stark', score=950),
            Leaderboard(user='Steve Rogers', score=1200),
            Leaderboard(user='Natasha Romanoff', score=1050),
            Leaderboard(user='Bruce Wayne', score=1350),
            Leaderboard(user='Clark Kent', score=800),
            Leaderboard(user='Diana Prince', score=1500),
        ]
        for entry in leaderboard_entries:
            entry.save()
        self.stdout.write(f'Created {len(leaderboard_entries)} leaderboard entries.')

        # Create workouts
        workouts = [
            Workout(name='Iron Man Cardio Blast', description='High intensity interval training inspired by Tony Stark\'s reactor workouts.', duration=30.0),
            Workout(name='Super Soldier Strength', description='Steve Rogers\' comprehensive strength and endurance program.', duration=60.0),
            Workout(name='Black Widow Flexibility', description='Natasha\'s elite flexibility and agility circuit training.', duration=45.0),
            Workout(name='Dark Knight Endurance', description='Bruce Wayne\'s grueling endurance and combat conditioning.', duration=90.0),
            Workout(name='Man of Steel Power', description='Superman-inspired power lifting and speed drills.', duration=50.0),
            Workout(name='Amazonian Warrior Training', description='Wonder Woman\'s ancient warrior training with modern techniques.', duration=75.0),
        ]
        for workout in workouts:
            workout.save()
        self.stdout.write(f'Created {len(workouts)} workouts.')

        self.stdout.write(self.style.SUCCESS('Successfully populated the octofit_db database with test data!'))
