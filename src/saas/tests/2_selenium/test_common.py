import unittest
import pytest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

class TestCommonPages(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get('http://saas.com')

    def tearDown(self):
        self.driver.close()

    def test_home_page(self):
        self.assertIn('Welcome', self.driver.title)

    def test_signin_page(self):
        elem = self.driver.find_element_by_css_selector('.navbar-item.has-dropdown.is-hoverable')
        hover = ActionChains(self.driver).move_to_element(elem)
        hover.perform()

        elem = self.driver.find_element_by_id('link-add-security-signin')
        elem.click()

        elem2 = WebDriverWait(self.driver, 10).until(
            EC.title_contains('Sign In')
        )
        self.assertIn('Sign In', self.driver.title)

    def test_google_signin(self):
        elem = self.driver.find_element_by_css_selector('.navbar-item.has-dropdown.is-hoverable')
        hover = ActionChains(self.driver).move_to_element(elem)
        hover.perform()

        elem = self.driver.find_element_by_id('link-add-security-signin')
        elem.click()

        elem2 = WebDriverWait(self.driver, 10).until(
            EC.title_contains('Sign In')
        )

        if 'Sign In' in self.driver.title:
            elem = self.driver.find_element_by_class_name('link-google')
            elem.click()

            elem = WebDriverWait(self.driver, 10).until(
                EC.title_contains('Google')
            )

            elem = WebDriverWait(self.driver, 30).until(
                EC.title_contains('Welcome')
            )

            self.assertIn('Welcome', self.driver.title)
        else:
            self.fail('failed to navigate to google signin')