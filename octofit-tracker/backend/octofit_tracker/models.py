from djongo import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=50, unique=True)
    members = models.JSONField(default=list)
    def __str__(self):
        return self.name

class Activity(models.Model):
    user = models.EmailField()
    activity = models.CharField(max_length=50)
    distance = models.FloatField()
    def __str__(self):
        return f"{self.user} - {self.activity}"

class Leaderboard(models.Model):
    team = models.CharField(max_length=50)
    points = models.IntegerField()
    def __str__(self):
        return f"{self.team}: {self.points}"

class Workout(models.Model):
    user = models.EmailField()
    workout = models.CharField(max_length=50)
    reps = models.IntegerField()
    def __str__(self):
        return f"{self.user} - {self.workout}"