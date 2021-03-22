from application.sync.events.abstract_event import AbstractTypename


class PixOut(AbstractTypename):

    @property
    def title(self) -> str:
        detail = self._event['detail'].split('\n')[0]
        return f'{self._event["title"]} - {detail}'

    @property
    def amount(self) -> float:
        raw_amount = self._event['detail'].split('\n')[1].strip('R$\xa0')
        amount = float(raw_amount.replace('.', '').replace(',', '.')) * -1
        return amount

    @property
    def category(self) -> str:
        return 'PixOutEvent'
