from datetime import datetime

from pymongo.collection import Collection


class TransactionModel:
    def __init__(self, category_map_collection: Collection, title_mapping_collection: Collection,
                 fixed_transaction_collection: Collection, id_: str, post_date: datetime, raw_title: str,
                 raw_category: str, charges: int, amount: float, ref_id: str, index: int, type_: str):

        self._category_map_collection = category_map_collection
        self._title_mapping_collection = title_mapping_collection
        self._fixed_transaction_collection = fixed_transaction_collection

        self.id = id_
        self.time = post_date
        self.raw_title = raw_title

        self.charges = charges
        self.ref_id = ref_id
        self._amount = amount
        self.index = index
        self.type = type_

        self.is_ignored = None
        self.use_raw_category = None

        self._to_save = {}

        self._is_fixed = None
        self._raw_category = raw_category

        self.same_name_check = None
        self.same_category_check = None

    @property
    def charges_paid(self):
        if self.index:
            return self.index

    @property
    def is_fixed(self):
        if self._is_fixed:
            return self._is_fixed

        is_fixed = False
        result = self._fixed_transaction_collection.find_one({'_id': self.name})
        if result:
            is_fixed = True
        return is_fixed

    @is_fixed.setter
    def is_fixed(self, value):
        self._is_fixed = value

    @property
    def name(self):
        name = None
        title_by_trx_id = None

        title_by_raw_title = self._title_mapping_collection.find_one({'_id': self.raw_title}) or {}
        if title_by_raw_title and title_by_raw_title['value']:
            name = title_by_raw_title['value']

        if self.ref_id:
            title_by_ref_id = self._title_mapping_collection.find_one({'_id': self.ref_id})
            if title_by_ref_id and title_by_ref_id['value']:
                name = title_by_ref_id['value']

        if self.id:
            title_by_trx_id = self._title_mapping_collection.find_one({'_id': self.id})
            if title_by_trx_id and title_by_trx_id['value']:
                name = title_by_trx_id['value']
                self.is_ignored = title_by_trx_id.get('is_ignored', False)

        same_name_check = None
        if title_by_raw_title.get('value') and not title_by_trx_id:
            same_name_check = True
        self.same_name_check = same_name_check

        if name:
            return name
        else:
            return self.raw_title

    @name.setter
    def name(self, value):
        self._to_save['title'] = value

    @property
    def category(self):
        category = None

        # pelo id da trx
        category_by_trx_id = self._category_map_collection.find_one({'_id': self.id}) or {}
        if category_by_trx_id and category_by_trx_id.get('value'):
            category = category_by_trx_id['value']

        # pelo titulo da transação
        category_by_trx_title = self._category_map_collection.find_one({'_id': self.name}) or {}
        if category_by_trx_title and category_by_trx_title['value']:
            category = category_by_trx_title['value']

        same_category_check = None
        if category_by_trx_title.get('value') and not category_by_trx_id.get('value'):
            same_category_check = True

        self.same_category_check = same_category_check

        if category:
            self.use_raw_category = False
            return category
        else:
            self.use_raw_category = True
            return self._raw_category

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
    def same_transaction_name(self):
        return None

    @same_transaction_name.setter
    def same_transaction_name(self, value):
        self._to_save['same_transaction_name'] = value

    @property
    def same_transaction_charge(self):
        return None

    @same_transaction_charge.setter
    def same_transaction_charge(self, value):
        self._to_save['same_transaction_charge'] = value

    def save(self):
        if self._to_save.get('category_type'):
            id_ = None
            if self._to_save['category_type'] == 'trx':
                id_ = self.id
            elif self._to_save['category_type'] == 'same_name':
                id_ = self.name
            self._category_map_collection.update_one({'_id': id_}, {"$set": {"value": self._to_save['category']}},
                                                     upsert=True)

        elif self._to_save.get('same_transaction_name') is not None:

            if self._to_save['same_transaction_name'] is True:
                self._title_mapping_collection.update_one({'_id': self.raw_title}, {"$set": {"value": self._to_save['title']}}, upsert=True)

            elif self._to_save['same_transaction_charge'] is True:
                if self.charges:
                    self._title_mapping_collection.update_one({'_id': self.ref_id}, {"$set": {"value": self._to_save['title']}}, upsert=True)

            else:
                self._title_mapping_collection.update_one({'_id': self.id}, {"$set": {"value": self._to_save['title']}}, upsert=True)
