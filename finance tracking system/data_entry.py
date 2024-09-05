from datetime import datetime

date_format = '%d-%m-%Y'
data_category = {"I": 'Income', "E": 'Expense'}

def get_date(prompt, default_date=False):
    date_str = input(prompt)
    if default_date and not date_str:
        return datetime.now().strftime(date_format)
    else:
        try:
            valid_date = datetime.strptime(date_str, date_format)
            return valid_date.strftime(date_format)
        except ValueError:
            print('Please enter the date in this dd-mm-yyyy format.')
            return get_date(prompt, default_date)

def get_amount():
    try:
        amount = float(input('Enter the amount: '))
        if amount < 0:
            raise ValueError('The amount must be a non-negative number.')
        return amount
    except ValueError as e:
        print('Invalid value:', e)
        return get_amount()

def get_category():
    category = input('Enter the category ("I" for Income and "E" for Expense): ').upper()
    if category in data_category:
        return data_category[category]
    print('Please enter a valid category ("I" for Income and "E" for Expense).')
    return get_category()

def get_discription():
    return input('Enter the description (optional): ')
