from django.http import JsonResponse, HttpResponse
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.viewsets import GenericViewSet

from studentplanner import models, serializers


class SemesterViewSet(GenericViewSet):
    serializer_class = serializers.SemesterSerializer

    def get(self, request):
        if _id := self.request.query_params.get("id", False):
            return serializers.SemesterSerializer(models.Semester.objects.get(pk=_id))
        return JsonResponse({
            "semesters": serializers.SemesterSerializer(
                models\
                    .Semester\
                    .objects\
                    .filter(user=self.request.user),
                many=True).data
        })

    def post(self, request):
        data = self.serializer_class(data=request.data)
        if data.is_valid():
            data.save(user=self.request.user)
            return JsonResponse({'status': HTTP_201_CREATED})
        return JsonResponse({"status": HTTP_400_BAD_REQUEST})
