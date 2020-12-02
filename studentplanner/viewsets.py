from django.http import JsonResponse, HttpResponse
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.viewsets import GenericViewSet

from studentplanner import models, serializers


class SemesterViewSet(GenericViewSet):
    serializer_class = serializers.SemesterSerializer

    def get(self, request):
        if _id := self.request.query_params.get("id", False):
            return JsonResponse({
                "semester": serializers
                    .SemesterSerializer(
                        models
                            .Semester
                            .objects
                            .get(pk=_id)
                )
                .data
            })
        return JsonResponse({
            "semesters": serializers.SemesterSerializer(
                models
                    .Semester
                    .objects
                    .filter(user=self.request.user),
                many=True).data
        })

    def post(self, request):
        data = self.serializer_class(data=request.data)
        if data.is_valid():
            data.save(user=self.request.user)
            return JsonResponse({'status': HTTP_201_CREATED})
        return JsonResponse({"status": HTTP_400_BAD_REQUEST})


class DisciplineViewSet(GenericViewSet):
    serializer_class = serializers.DisciplineSerializer

    def get(self, request):
        if _id := self.request.query_params.get("id", False):
            return serializers.DisciplineSerializer(models.Discipline.objects.get(pk=_id))
        if semester :=  self.request.query_params.get("semester", False):
            return JsonResponse({
                "disciplines": serializers.DisciplineSerializer(
                    models.Discipline.objects.filter(
                        semester_id=semester
                    ),
                    many=True
                ).data
            })
        return JsonResponse({
            "disciplines": serializers.DisciplineSerializer(
                models\
                    .Semester\
                    .objects\
                    .filter(user=self.request.user),
                many=True).data
        })

    def post(self, request):
        rdata = dict(request.data)
        rdata["semester"]=int(request.data["semester"])
        rdata["teachers"]="[]"
        if isinstance(rdata["name"], list) and len(rdata["name"])==1:
            rdata["name"]=rdata["name"][0]
        rdata["tasks"]="[]"
        data = self.serializer_class(data=rdata)
        if data.is_valid():
            obj=data.save(user=self.request.user)
            sem_pk = rdata["semester"]
            sem = models.Semester.objects.get(pk=sem_pk)
            disciplines = list(models.get_disciplines(sem.disciplines))
            disciplines.append(obj)
            sem.disciplines = repr(list(map(lambda x: x.pk, disciplines)))
            sem.save()
            return JsonResponse({'status': HTTP_201_CREATED})
        return JsonResponse({"status": HTTP_400_BAD_REQUEST})
