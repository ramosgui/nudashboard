POSITIVE_CATEGORIES = ['TransferInEvent', 'TransferOutReversalEvent', 'transaction_reversed']
NEGATIVE_CATEGORIES = ['TransferOutEvent', 'DebitPurchaseEvent', 'BarcodePaymentEvent', 'transaction', 'PixOutEvent',
                       'PhoneRechargeSuccessEvent']

GENERICS_EVENT_TYPES = [
    'GenericFeedEvent',
    'BillPaymentEvent',
    'RemoveFromReserveEvent',
    'AddToReserveEvent',
    'LockMoneySuccessEvent',
    'BarcodePaymentFailureEvent',
    'WelcomeEvent',
    'AutomaticSavingsReserveEvent',
    'ScheduledBarcodePaymentRequestFailedEvent',

    'bill_flow_paid',
    'payment',
    'bill_flow_closed',  # Fatura fechada
    'anticipate_event',  # Parcelas antecipadas (desconto)
    'rewards_redemption',  # Nubank Rewards (apagar compra)
    'rewards_fee',  # Assinatura nubank rewards
    'customer_password_changed',
    'account_limit_set',  # Limite alterado
    'card_activated',  # Cartao ativado
    'rewards_signup',
    'customer_device_authorized',
    'due_day_changed',
    'rewards_canceled',
    'initial_account_limit',
    'tutorial',
    'customer_invitations_changed',
    'welcome'
]

ALL_VALID_EVENT_TYPES = POSITIVE_CATEGORIES + NEGATIVE_CATEGORIES + GENERICS_EVENT_TYPES

