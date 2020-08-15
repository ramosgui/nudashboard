from datetime import datetime

from pymongo.collection import Collection


class TransactionModel:
    def __init__(self, category_map_collection: Collection, title_mapping_collection: Collection, id_: str,
                 post_date: datetime, raw_title: str, raw_category: str, charges: int, amount: float, ref_id: str,
                 index: int, type_: str):

        self._category_map_collection = category_map_collection
        self._title_mapping_collection = title_mapping_collection

        self.id = id_
        self.time = post_date
        self.raw_title = raw_title
        self.raw_category = raw_category
        self.charges = charges
        self.ref_id = ref_id
        self._amount = amount
        self.index = index
        self.type = type_

        self.title_by_trx_id = None
        self.title_by_raw_title = None
        self.title_by_ref_id = None

        self.category_by_trx_id = None
        self.category_by_trx_title = None

        self._to_save = {}

    @property
    def charges_paid(self):
        if self.charges and self.charges > 1:
            return self.index + 1

    @property
    def title(self):
        title = None

        title_by_raw_title = self._title_mapping_collection.find_one({'_id': self.raw_title})
        if title_by_raw_title and title_by_raw_title['value']:
            self.title_by_raw_title = title_by_raw_title['value']
            title = title_by_raw_title['value']

        title_by_ref_id = self._title_mapping_collection.find_one({'_id': self.ref_id})
        if title_by_ref_id and title_by_ref_id['value']:
            self.title_by_ref_id = title_by_ref_id['value']
            title = title_by_ref_id['value']

        title_by_trx_id = self._title_mapping_collection.find_one({'_id': self.id})
        if title_by_trx_id and title_by_trx_id['value']:
            self.title_by_trx_id = title_by_trx_id['value']
            title = title_by_trx_id['value']

        if title:
            return title
        else:
            return self.raw_title

    @title.setter
    def title(self, value):
        self._to_save['title'] = value

    @property
    def category(self):
        category = None

        # pelo titulo da transação
        category_by_trx_title = self._category_map_collection.find_one({'_id': self.title})
        if category_by_trx_title and category_by_trx_title['value']:
            self.category_by_trx_title = category_by_trx_title['value']
            category = category_by_trx_title['value']

        # pelo id da trx
        category_by_trx_id = self._category_map_collection.find_one({'_id': self.id})
        if category_by_trx_id and category_by_trx_id.get('value'):
            self.category_by_trx_id = category_by_trx_id['value']
            category = category_by_trx_id['value']

        if category:
            return category
        else:
            return 'Sem Categoria'

    @category.setter
    def category(self, value):
        self._to_save['category'] = value

    @property
    def amount(self):
        return self._amount
        # value = self._amount / 100
        # return float('%.2f' % value)

    @property
    def category_type(self):
        return 'ok'

    @category_type.setter
    def category_type(self, value):
        self._to_save['category_type'] = value

    @property
    def title_type(self):
        return 'ok'

    @title_type.setter
    def title_type(self, value):
        self._to_save['title_type'] = value

    def save(self):
        if self._to_save.get('category_type'):
            id_ = None
            if self._to_save['category_type'] == 'trx':
                id_ = self.id
            elif self._to_save['category_type'] == 'same_name':
                id_ = self.title
            self._category_map_collection.update_one({'_id': id_}, {"$set": {"value": self._to_save['category']}},
                                                     upsert=True)

        elif self._to_save.get('title_type'):
            if self._to_save['title_type'] == 'trx':
                self._title_mapping_collection.update_one({'_id': self.id}, {"$set": {"value": self._to_save['title']}}, upsert=True)
            elif self._to_save['title_type'] == 'same_name':
                self._title_mapping_collection.update_one({'_id': self.raw_title}, {"$set": {"value": self._to_save['title']}}, upsert=True)
            elif self._to_save['title_type'] == 'charges':
                if self.ref_id:
                    self._title_mapping_collection.update_one({'_id': self.ref_id}, {"$set": {"value": self._to_save['title']}}, upsert=True)
