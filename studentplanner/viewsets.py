import datetime
from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.viewsets import GenericViewSet

from studentplanner import models, serializers


class SemesterViewSet(GenericViewSet):
    serializer_class = serializers.SemesterSerializer

    def get(self, request: Request):
        if _id := self.request.query_params.get("id", False):
            sem = models.Semester.objects.get(pk=int(_id))
            return JsonResponse({
                "semester": serializers.SemesterSerializer(sem).data,
                "disciplines": serializers.DisciplineSerializer(
                    models.get_disciplines(sem.disciplines),
                    many=True
                ).data,
                "average_mark": sem.get_avg_mark()
            })

        if self.request.query_params.get("current", False):
            semesters = serializers.SemesterSerializer(models.Semester.current_only(self.request.user), many=True).data

            for i in semesters:
                i["avg_mark"] = models.Semester.objects.get(pk=i["id"]).get_avg_mark()

            return JsonResponse({
                "semesters": semesters
            })

        return JsonResponse({
            "semesters": serializers.SemesterSerializer(
                models
                    .Semester
                    .objects
                    .filter(user=self.request.user),
                many=True).data
        })

    def post(self, request: Request):
        data = self.serializer_class(data=request.data)
        if data.is_valid():
            data.save(user=self.request.user)
            return JsonResponse({'status': HTTP_201_CREATED})
        return JsonResponse({"status": HTTP_400_BAD_REQUEST})


class DisciplineViewSet(GenericViewSet):
    serializer_class = serializers.DisciplineSerializer

    def get(self, request: Request):
        if _id := self.request.query_params.get("id", False):
            discipline = models.Discipline.objects.get(pk=_id)
            return JsonResponse({
                "discipline": serializers.DisciplineSerializer(
                    discipline
                ).data,
                "tasks": serializers.TaskSerializer(
                    models.Task.objects.filter(discipline_id=_id),
                    many=True
                ).data,
                "average_mark": discipline.get_avg_mark()
            })
        if semester :=  self.request.query_params.get("semester", False):
            disciplines = serializers.DisciplineSerializer(models.Discipline.objects.filter(semester_id=semester), many=True).data

            for i in disciplines:
                i["avg_mark"] = models.Discipline.objects.get(pk=i["id"]).get_avg_mark()

            return JsonResponse({
                "disciplines": disciplines
            })
        return JsonResponse({
            "disciplines": serializers.DisciplineSerializer(
                models\
                    .Discipline\
                    .objects\
                    .filter(user=self.request.user),
                many=True).data
        })

    def post(self, request: Request):
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

class TaskViewSet(GenericViewSet):
    serializer_class = serializers.TaskSerializer

    def post(self, request: Request):
        rdata = dict(request.data)
        if "numerator" in rdata.keys():
            return self.save_mark(rdata)
        return self.add_new_task(rdata)

    def add_new_task(self, rdata):
        for i in ["name", "description", "due_time"]:
            if isinstance(rdata[i], list) and len(rdata[i]) == 1:
                rdata[i] = rdata[i][0]
        for i in ["discipline", "priority"]:
            if isinstance(rdata[i], list) and len(rdata[i]) == 1:
                rdata[i] = int(rdata[i][0])
        rdata["title"] = rdata["name"]
        rdata["is_completed"] = rdata.get("is_completed", False)
        data = self.serializer_class(data=rdata)
        if not data.is_valid(True):
            return JsonResponse({"status": HTTP_400_BAD_REQUEST})
        obj = data.save(user=self.request.user)
        dis = models.Discipline.objects.get(pk=rdata["discipline"])
        tasks = list(models.get_tasks(dis.tasks))
        tasks.append(obj)
        dis.tasks = repr(list(map(lambda x: x.pk, tasks)))
        dis.save()
        return JsonResponse({'status': HTTP_201_CREATED})

    def get(self, request: Request):
        if _id := request.query_params.get("id", False):
            return JsonResponse({
                "task": serializers
                    .TaskSerializer(
                    models\
                        .Task\
                        .objects\
                        .get(pk=_id)
                ).data
            })

        current_only = request.query_params.get("current_only", False)
        incompleted_only = request.query_params.get("completed_only", False)
        if current_only and incompleted_only:
            queryset = models.Task.objects.raw(
                f'select * from studentplanner_task where user_id={request.user.pk} and not is_completed and {datetime.date.today().strftime("YYYY-MM-DD")} <= studentplanner_task.due_time')
        elif current_only:
            queryset = models.Task.current_only(request.user)
        elif incompleted_only:
            queryset = models.Task.objects.raw(
                f'select * from studentplanner_task where user_id={request.user.pk} and not is_completed')
        else:
            queryset = models.Task.objects.filter(user=self.request.user)
        return JsonResponse({
                "tasks": serializers.TaskSerializer(
                    queryset,
                    many=True).data})

    def save_mark(self, rdata):
        for i in rdata:
            rdata[i] = int(rdata[i][0])
        obj = models.Task.objects.get(pk=rdata['pk'])
        obj.mark_numerator = rdata['numerator']
        obj.mark_denominator = rdata['denominator']
        obj.is_completed = True
        obj.save()
        return JsonResponse({'status': 'mark have saved'}, status=HTTP_201_CREATED)
