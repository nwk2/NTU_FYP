from app.models import Project, ProjectAllocation, Task, Report
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from app.api.serializers import ProjectSerializer, ProjectAllocationSerializer, TaskOnlySerializer, TaskSerializer, ReportSerializer, UserSerializer, UserProjectSerializer, TestSerializer
from rest_framework import generics

###### AUTH SNIPPET
from rest_framework.authentication import TokenAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

#######  test protected view #############
class HelloView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
##########################################

from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)
from django.contrib.auth import authenticate
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"Authorization": 'Token ' + token.key},
                    status=HTTP_200_OK)

#gets proj of current logged in user
# class UserProject(generics.ListAPIView):
#     queryset = ProjectAllocation.objects.all()
#     serializer_class = UserProjectSerializer
#     def get_queryset(self):
#         user = self.request.user
#         return ProjectAllocation.objects.filter(user=user)

class UserProject(generics.ListAPIView):
    serializer_class = UserProjectSerializer
    queryset = ProjectAllocation.objects.all()
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return ProjectAllocation.objects.all()
        else:
            return ProjectAllocation.objects.filter(user=user)

class AddNewReport(generics.ListCreateAPIView):
    permission_classes = (AllowAny,)
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(author=req.user)

class TaskListCreate(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
class NewTask(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = Task.objects.all()
    serializer_class = TaskOnlySerializer







class ProjectListCreate(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
class ProjectDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
class AllocationListCreate(generics.ListCreateAPIView):
    queryset = ProjectAllocation.objects.all()
    serializer_class = ProjectAllocationSerializer
class AllocationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectAllocation.objects.all()
    serializer_class = ProjectAllocationSerializer

class TaskDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

#################################

# class ProjectViewSet(viewsets.ModelViewSet):
#     #permission_classes = (IsAuthenticated,)
#     queryset = Project.objects.all()
#     serializer_class = ProjectSerializer
# class AllocationViewSet(viewsets.ModelViewSet):
#     #permission_classes = (IsAuthenticated,)
#     queryset = ProjectAllocation.objects.all()
#     serializer_class = ProjectAllocationSerializer
# class TaskViewSet(viewsets.ModelViewSet):
#     #permission_classes = (IsAuthenticated,)
#     queryset = Task.objects.all()
#     serializer_class = TaskSerializer
# class ReportViewSet(viewsets.ModelViewSet):
#     #permission_classes = (IsAuthenticated,)
#     queryset = Report.objects.all()
#     serializer_class = ReportSerializer
# class CurrentUserViewSet(viewsets.ModelViewSet):
#     permission_classes = (IsAuthenticated,)
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def get_object(self):
#         return self.request.user
    
#     def list(self, request, *args, **kwargs):
#         return self.retrieve(request, *args, **kwargs)