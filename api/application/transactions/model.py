from datetime import datetime


class TransactionModel:
    def __init__(self, id_: str, post_date: datetime, raw_title: str, title_by_id: str, title_by_map: str,
                 raw_category: str, category_by_id: str, category_by_map: str, charges_paid: int, charges: int,
                 amount: float):
        self.id = id_
        self.time = post_date
        self.raw_title = raw_title
        self.title_by_id = title_by_id
        self.title_by_map = title_by_map
        self.raw_category = raw_category
        self.category_by_id = category_by_id
        self.category_by_map = category_by_map
        self.charges_paid = charges_paid
        self.charges = charges
        self._amount = amount

    @property
    def category(self):
        if self.category_by_id:
            return self.category_by_id
        elif self.category_by_map:
            return self.category_by_map
        else:
            return 'Sem Categoria'

    @property
    def title(self):
        if self.title_by_id:
            return self.title_by_id
        elif self.title_by_map:
            return self.title_by_map
        else:
            return self.raw_title

    @property
    def amount(self):
        value = self._amount / 100
        return float('%.2f' % value)
