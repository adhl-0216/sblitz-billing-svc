SELECT 
    bills.id AS bill_id, 
    bills.title, 
    bills.description, 
    bills.currency, 
    bills.total_amount, 
    bills.owner_id, 
    bills.created_at, 
    bills.updated_at, 
    bill_members.id AS member_id, 
    bill_members.name, 
    bill_members.color_code, 
    bill_members.bill_id 
FROM 
    bills
LEFT JOIN 
    bill_members ON bill_members.bill_id = bills.id 
WHERE  
    bills.owner_id = '5b54b197-9d23-4e16-a5cf-6ecd223ab041'; 