from django.contrib import admin
from .models import Project, ProjectAllocation, Task, Report


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('project_id', 'project_title', 'project_description', )
    list_display_links = ('project_id', 'project_title', 'project_description', )
    search_fields = ('project_title', 'project_description')

class ProjectAllocationAdmin(admin.ModelAdmin):
    list_display = ('project', 'user',)
    list_display_links = ('project', 'user',)
    search_fields = ('project', 'user')

class TaskAdmin(admin.ModelAdmin):
    list_display = ('project','due_date')
    list_display_links = ('project','due_date')

class ReportAdmin(admin.ModelAdmin):
    list_display = ('task', 'report_title', 'author', 'timestamp')
    list_display_links = ('task', 'report_title', 'author', 'timestamp')
    search_fields = ('report_title', 'author', 'timestamp')



admin.site.register(Project, ProjectAdmin)
admin.site.register(ProjectAllocation, ProjectAllocationAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Report, ReportAdmin)