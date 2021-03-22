from application.sync.events.abstract_event import AbstractTypename


class TransferOutEvent(AbstractTypename):

    @property
    def title(self) -> str:
        return f'{self._event["title"]} - {self._event["destinationAccount"]["name"]}'

    @property
    def amount(self) -> float:
        return self._event["amount"] * -1
