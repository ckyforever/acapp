from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    line1 = '<h1 style="text-align: center">术士之战</h1>'
    line3 = '<hr>'
    line2 = '<img src="https://img1.baidu.com/it/u=4035339947,1492935398&fm=26&fmt=auto" width=2000>'
    return HttpResponse(line1 + line3 + line2)
