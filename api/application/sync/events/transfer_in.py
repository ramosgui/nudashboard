from application.sync.events.abstract_event import AbstractTypename


class TransferInEvent(AbstractTypename):

    @property
    def title(self) -> str:
        if self._event['originAccount']:
            title = f'{self._event["title"]} - {self._event["originAccount"]["name"]}'
        else:
            title = self._event['title']
        return title

    @property
    def amount(self) -> float:
        return self._event["amount"]
