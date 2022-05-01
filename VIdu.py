from selenium import webdriver
from time import sleep

browser = webdriver.Chrome(executable_path="chromedriver.exe")
browser.get("https://9nice.site/dwqa-questions/")
i=0
part = browser.find_elements_by_class_name("dwqa-question-item")
for x in part:
    i+=1
    equal = x.find_element_by_xpath("div[2]/span/a")
# Tại sao lại không phải lệnh này :equal = x.find_element_by_xpath("div[2]/span[2]/a")
    print(equal.text)
