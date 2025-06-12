from django.shortcuts import render
from .models import Tutor, Course, Student, ScheduledSession, Attendance, ChangeCourse,  Test, Language, Level
from .serializers import TutorSerializer, CourseSerializer, StudentSerializer, ScheduledSessionSerializer, AttendanceSerializer, ChangeCourseSerializer, TestSerializer, LanguageSerializer, LevelSerializer
from rest_framework import viewsets
# Create your views here.


class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all()
    serializer_class = TutorSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class ScheduledSessionViewSet(viewsets.ModelViewSet):
    queryset = ScheduledSession.objects.all()
    serializer_class = ScheduledSessionSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class ChangeCourseViewSet(viewsets.ModelViewSet):
    queryset = ChangeCourse.objects.all()
    serializer_class = ChangeCourseSerializer

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer