from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create your models here.
class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    project_title = models.CharField(max_length=255)
    project_description = models.TextField(max_length=255)
    start = models.DateField(default=None, blank=True, null=True)
    end = models.DateField(default=None, blank=True, null=True)

    def __str__(self):
        return self.project_title

class ProjectAllocation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return '%s %s' % (self.project, self.user)
        
    class Meta:
        unique_together = (('project', 'user'),)

class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, related_name='tasks', on_delete=models.CASCADE)
    due_date = models.DateField(default=None)

    def __str__(self):
        return '%s' % (self.due_date)

class Report(models.Model):
    task = models.OneToOneField(Task, related_name='reports', on_delete=models.CASCADE, primary_key=True)
    report_title = models.CharField(max_length=100)
    text = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'For request: [ %s] | Title: %s | Text: %s | Author: %s' % (self.task, self.report_title, self.text, self.author)
    def __unicode__(self):
        return '%s' % (self.report_title, self.text, self.timestamp)
""" class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    report = models.ForeignKey(Report)
    author = models.ForeignKey(User)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __self__(self):
        return self.text """
