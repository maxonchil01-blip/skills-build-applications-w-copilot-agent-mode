from django.core.management.base import BaseCommand
from django.conf import settings
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        client = MongoClient('mongodb://localhost:27017/')
        db = client['octofit_db']

        # Очистити колекції
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Створити унікальний індекс для email
        db.users.create_index([('email', 1)], unique=True)

        # Демо-дані
        users = [
            {"name": "Iron Man", "email": "ironman@marvel.com", "team": "marvel"},
            {"name": "Captain America", "email": "cap@marvel.com", "team": "marvel"},
            {"name": "Batman", "email": "batman@dc.com", "team": "dc"},
            {"name": "Wonder Woman", "email": "wonderwoman@dc.com", "team": "dc"},
        ]
        teams = [
            {"name": "marvel", "members": ["ironman@marvel.com", "cap@marvel.com"]},
            {"name": "dc", "members": ["batman@dc.com", "wonderwoman@dc.com"]},
        ]
        activities = [
            {"user": "ironman@marvel.com", "activity": "run", "distance": 5},
            {"user": "cap@marvel.com", "activity": "cycle", "distance": 10},
            {"user": "batman@dc.com", "activity": "swim", "distance": 2},
            {"user": "wonderwoman@dc.com", "activity": "run", "distance": 8},
        ]
        leaderboard = [
            {"team": "marvel", "points": 150},
            {"team": "dc", "points": 120},
        ]
        workouts = [
            {"user": "ironman@marvel.com", "workout": "pushups", "reps": 50},
            {"user": "cap@marvel.com", "workout": "situps", "reps": 60},
            {"user": "batman@dc.com", "workout": "pullups", "reps": 30},
            {"user": "wonderwoman@dc.com", "workout": "squats", "reps": 70},
        ]

        db.users.insert_many(users)
        db.teams.insert_many(teams)
        db.activities.insert_many(activities)
        db.leaderboard.insert_many(leaderboard)
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data!'))
