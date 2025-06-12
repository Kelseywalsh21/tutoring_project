from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tutors', views.TutorViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'students', views.StudentViewSet)
router.register(r'sessions', views.ScheduledSessionViewSet)
router.register(r'attendance', views.AttendanceViewSet)
router.register(r'changecourse', views.ChangeCourseViewSet)
router.register(r'tests', views.TestViewSet)
router.register(r'languages', views.LanguageViewSet)
router.register(r'levels', views.LevelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]