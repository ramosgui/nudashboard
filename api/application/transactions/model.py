from datetime import datetime

from pymongo.collection import Collection


class TransactionModel:
    def __init__(self, transactions_collection: Collection, category_map_collection: Collection, id_: str,
                 post_date: datetime, raw_title: str, title_by_id: str, title_by_map: str, raw_category: str,
                 category_by_id: str, category_by_map: str, charges_paid: int, charges: int, amount: float, ref_id: str,
                 title_by_ref: str):
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
        self.ref_id = ref_id
        self._amount = amount
        self.title_by_ref = title_by_ref

        self._to_save = {}

        self._transactions_collection = transactions_collection
        self._category_map_collection = category_map_collection

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
        if self.title_by_ref:
            return self.title_by_ref
        elif self.title_by_id:
            return self.title_by_id
        elif self.title_by_map:
            return self.title_by_map
        else:
            return self.raw_title

    @property
    def amount(self):
        value = self._amount / 100
        return float('%.2f' % value)

    @category.setter
    def category(self, value):
        self._to_save['category'] = value

    @property
    def category_type(self):
        return 'ok'

    @category_type.setter
    def category_type(self, value):
        self._to_save['category_type'] = value

    def save(self):
        if self._to_save['category_type'] == 'trx':
            self._transactions_collection.update_one({'_id': self.id}, {"$set": {"new_category": self._to_save['category']}})
        elif self._to_save['category_type'] == 'same_name':
            self._category_map_collection.update_one({'_id': self.title}, {"$set": {"category": self._to_save['category']}}, upsert=True)
