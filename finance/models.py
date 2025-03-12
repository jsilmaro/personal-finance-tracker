from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    TRANSACTION_TYPE = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    date = models.DateField()
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPE)

    def __str__(self):
        return f"{self.transaction_type.capitalize()}: {self.amount} on {self.date}"