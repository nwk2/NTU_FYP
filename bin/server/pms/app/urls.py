from django.urls import path, include
from . import views

urlpatterns = [
    path('projects/', views.ProjectListCreate.as_view() ),
    path('projects/<int:pk>', views.ProjectDetailAPIView.as_view(), ),
    path('allocation/', views.AllocationListCreate.as_view() ),
    path('allocation/<int:pk>', views.AllocationDetailAPIView.as_view(), ),
    
    #project of current logged in user
    path('userproject/', views.UserProject.as_view() ),
    path('addnewreport/', views.AddNewReport.as_view() ),
    path('addnewreport/<int:pk>', views.AddNewReport.as_view() ),
    path('admincalendar/', views.TaskListCreate.as_view() ),
    path('addtask/', views.NewTask.as_view())
    
]