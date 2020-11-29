from django.urls import path, include
from studentplanner import viewsets


# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('semester/', viewsets.SemesterViewSet.as_view({'get':'get'})),
    path('discipline/', viewsets.DisciplineViewSet.as_view({'get':'get'})),
]