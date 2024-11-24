INSERT INTO BILLS (
    title,
    description,
    currency,
    total_amount,
    created_at,
    updated_at
) VALUES (
    'Weekend Getaway Expenses',
    'Shared costs for beach house rental and groceries',
    'EUR',
    450.75,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
);