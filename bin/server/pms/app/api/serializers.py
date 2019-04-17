from rest_framework import serializers
from app.models import Project, ProjectAllocation, Task, Report
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(default=serializers.CurrentUserDefault())
    class Meta:
        model = Report
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    reports = ReportSerializer()
    class Meta:
        depth = 1
        model = Task
        fields = '__all__'

class TaskOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    #tasks = serializers.StringRelatedField(many=True)
    tasks = TaskSerializer(many=True)
    class Meta:
        model = Project
        #fields = '__all__'
        fields = ( 'project_id', 'tasks', 'project_title', 'project_description', 'start', 'end')

        # ( 'project_id', 'project_title', 'project_description', 'start', 'end')

class ProjectAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAllocation
        fields = '__all__'

class UserProjectSerializer(serializers.ModelSerializer):
    project = ProjectSerializer()
    user = UserSerializer()
    
    class Meta:
        depth = 0
        model = ProjectAllocation
        #exclude = ('user',)
        #fields = ('project', 'user')
        fields = ('project', 'user')

class TestSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField(many=True)
    class Meta:
        model = ProjectAllocation
        fields = '__all__'