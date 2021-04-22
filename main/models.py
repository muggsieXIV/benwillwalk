from django.db import models
import re

# Create your models here.

class ClientManager(models.Manager):
    def client_validator(self, form_data):
        errors = {}
        EMAIL_REGEX = EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
        if len(form_data['name']) < 4:
            errors['name'] = "Please provide your full name."
        if not EMAIL_REGEX.match(form_data['email']):
            errors['email'] = "Email doesn't look right, try again!"
        if len(form_data['subject']) < 1:
            errors['subject'] = "Cannot be empty"
        if len(form_data['comment']) < 20:
            errors['comment'] = "Please be more descriptive"
        return errors

class Client(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    comment = models.TextField()
    objects = ClientManager()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ("created_at", "name", "email", "subject", "comment")
    def __str__(self):
        return f"{self.name}, {self.email}, {self.subject}, {self.comment}, {str(self.created_at)}"

class SubscriberManager(models.Manager):
    def subscriber_validator(self, form_data):
        errors = {}
        EMAIL_REGEX = EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
        if not EMAIL_REGEX.match(form_data['email']):
            errors['email'] = "Email doesn't look right, try again!"
        return errors
    
class Subscriber(models.Model):
    email = models.EmailField()
    objects = SubscriberManager()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ("created_at", "email")
    def __str__(self):
        return f"{self.email}, {str(self.created_at)}"


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_one = models.ImageField(upload_to='static/assets/portfolio-detail')
    image_two = models.ImageField(upload_to='static/assets/portfolio-detail')
    image_three = models.ImageField(upload_to='static/assets/portfolio-detail')
    category = models.CharField(max_length=100)
    client = models.CharField(max_length=150)
    project_date = models.CharField(max_length=100)
    project_url = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ("title", "description", "image_one", "image_two", "image_three", "category", "client", "project_date", "project_url", "created_at")
    def __str__(self):
        return f"{self.title}, {self.description}, {self.image_one}, {self.image_two}, {self.image_three}, {self.category}, {self.client}, {self.project_date}, {self.project_url}"