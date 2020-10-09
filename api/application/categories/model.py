from collections import namedtuple

colorInfo = namedtuple('colorInfo', ('color_name', 'color_weight'))


class CategoryModel:

    def __init__(self, id_: str, icon_name: str, color_info: colorInfo, type_: str):
        self.id = id_
        self.icon_name = icon_name
        self.color_info = color_info
        self.type = type_
