# sblitz-billing-service

| ID  | Requirement Name                                                    | Category | Acceptance Criteria |
| --- | ------------------------------------------------------------------- | -------- | ------------------- |
| 01  | As a User, I want to view all my Bills                              | Bill     |                     |
| 02  | As a User, I want to create a new Bill                              | Bill     | -                   |
| 03  | As a User, I want to add an existing Friend to a Bill               | Bill     | -                   |
| 04  | As a User, I want to add a custom Friend to a Bill                  | Bill     | -                   |
| 05  | As a User, I want to add a new Item in a Bill                       | Bill     | -                   |
| 06  | As a User, I want to assign an Item to any Friend added to the Bill | Bill     | -                   |

# Diagrams

```mermaid
---
title: Class Diagram
---
classDiagram
    class Bill {
        - string title
        - string description
        - Person owner
        - datetime created_at
        - datetime updated_at
        - Person[] members
        - Item[] items

        + getTotalPrice()
        + addMember(Person member)
    }
    class Item {
        - string description
        - float price
        - int quantity
        - Split[] splits
    }
    class Person {
        - string displayName
        - string colorCode
    }

    class Split {
        - Person member
        - float amount
    }

    Bill *-- Item
    Bill *-- Person
    Item *-- Split
    Split o-- Person
```

```mermaid
---
title: ERD
---
erDiagram
    BILLS ||--o{ BILL_ITEMS : contains
    BILLS ||--o{ BILL_MEMBERS : has
    BILL_ITEMS ||--o{ ITEM_SPLIT : splits_into
    BILL_MEMBERS ||--o{ ITEM_SPLIT : assigned_to

    BILLS {
        UUID id PK
        VARCHAR title
        TEXT description
        VARCHAR currency
        NUMERIC total_amount
        UUID owner_id
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    BILL_ITEMS {
        UUID id PK
        UUID bill_id FK
        VARCHAR name
        NUMERIC price
        SPLIT_TYPE split_type
    }

    BILL_MEMBERS {
        UUID id PK
        VARCHAR name
        UUID bill_id FK
        VARCHAR color_code
    }

    ITEM_SPLIT {
        UUID id PK
        UUID bill_item_id FK
        UUID assignee_id FK
        NUMERIC split_value
    }
```

Note:

- Default splitType is EQUAL
- splitType can be Amount/Percent/Share, and will only be displayed on client side
- If splitType is changed, the splitValue is set to 0 for all
