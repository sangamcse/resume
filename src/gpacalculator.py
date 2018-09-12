#!/usr/local/bin/python3

def gpacalculator(n, credits, sgpas):
    grade = [credits[i] * sgpas[i] for i in range(n)]
    return sum(grade)/sum(credits)


n = int(input("Enter number of semester: "))

credits = []
sgpas = []

for i in range(n):
    credits.append(int(input("credit of semester-{}: ".format(i+1))))
    sgpas.append(float(input("sgpa of semester-{}: ".format(i+1))))

print("CGPA till {} semester is: {}".format(n, gpacalculator(n, credits, sgpas)))
