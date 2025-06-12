# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Attendance(models.Model):
    session = models.ForeignKey('ScheduledSession', models.DO_NOTHING)
    student = models.ForeignKey('Student', models.DO_NOTHING)
    attended = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'attendance'


class ChangeCourse(models.Model):
    course = models.ForeignKey('Course', models.DO_NOTHING)
    change_type = models.CharField()
    status = models.CharField()
    submitted_by = models.ForeignKey('Student', models.DO_NOTHING, db_column='submitted_by', blank=True, null=True)
    created_at = models.TextField(blank=True, null=True)  # This field type is a guess.
    updated_at = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'change_course'


class Course(models.Model):
    name = models.CharField()
    description = models.CharField(blank=True, null=True)
    tutor = models.ForeignKey('Tutor', models.DO_NOTHING, blank=True, null=True)
    language = models.ForeignKey('Language', models.DO_NOTHING, blank=True, null=True)
    format = models.CharField(blank=True, null=True)
    total_hours = models.IntegerField(blank=True, null=True)
    level = models.ForeignKey('Level', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'course'


class Language(models.Model):
    name = models.CharField(unique=True)

    class Meta:
        managed = False
        db_table = 'language'


class Level(models.Model):
    name = models.CharField(unique=True)

    class Meta:
        managed = False
        db_table = 'level'


class ScheduledSession(models.Model):
    course = models.ForeignKey(Course, models.DO_NOTHING)
    session_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(blank=True, null=True)
    status = models.CharField()
    approved = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'scheduled_session'


class Student(models.Model):
    first_name = models.CharField()
    last_name = models.CharField()
    email = models.CharField()
    phone_number = models.CharField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    course = models.ForeignKey(Course, models.DO_NOTHING, blank=True, null=True)
    dlpt_score = models.IntegerField(blank=True, null=True)
    level = models.ForeignKey(Level, models.DO_NOTHING, blank=True, null=True)
    address = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student'


class Test(models.Model):
    student = models.ForeignKey(Student, models.DO_NOTHING)
    score = models.IntegerField()
    date = models.DateField()
    description = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'test'


class Tutor(models.Model):
    first_name = models.CharField()
    last_name = models.CharField()
    email = models.CharField()
    phone_number = models.CharField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tutor'
