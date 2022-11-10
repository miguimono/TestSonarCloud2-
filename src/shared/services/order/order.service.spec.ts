import { OrderService } from './order.service';
import { createCaseField, createFieldType, createFixedListFieldType, textFieldType } from '../../fixture/shared.test.fixture';

describe('OrderService', () => {

  let orderService: OrderService;

  const ITEM_X = { id: 1, order: undefined };
  const ITEM_0 = { id: 0, order: 0 };
  const ITEM_1 = { id: 1, order: 1 };
  const ITEM_2 = { id: 2, order: 2 };

  beforeEach(() => {
    orderService = new OrderService();
  });

  describe('sortAsc', () => {

    it('should sort in ascending order', () => {
      expect(orderService.sortAsc(ITEM_1, ITEM_2)).toBe(-1);
      expect(orderService.sortAsc(ITEM_2, ITEM_1)).toBe(1);
    });

    it('should keep order of items with same order', () => {
      expect(orderService.sortAsc(ITEM_1, ITEM_1)).toBe(0);
    });

    it('should sort items without order at the end', () => {
      expect(orderService.sortAsc(ITEM_X, ITEM_1)).toBe(1);
    });

    it('should keep order of items without order', () => {
      expect(orderService.sortAsc(ITEM_X, ITEM_X)).toBe(0);
    });

    it('should consider 0 as a lower order', () => {
      expect(orderService.sortAsc(ITEM_1, ITEM_0)).toBe(1);
    });
  });

  describe('sort', () => {
    it('should return cloned array', () => {
      let array = [ITEM_0, ITEM_1, ITEM_2];
      let arrayClone = [ITEM_0, ITEM_1, ITEM_2];

      spyOn(array, 'slice').and.returnValue(arrayClone);

      let sortedArray = orderService.sort(array);

      expect(array.slice).toHaveBeenCalledWith();
      expect(sortedArray).toEqual(arrayClone);
    });

    it('should sort cloned array by ascending order', () => {
      let array = [ITEM_2, ITEM_1, ITEM_0];
      let arrayClone = [ITEM_2, ITEM_1, ITEM_0];
      let arrayExpected = [ITEM_0, ITEM_1, ITEM_2];

      spyOn(array, 'slice').and.returnValue(arrayClone);
      spyOn(arrayClone, 'sort').and.returnValue(arrayExpected);

      let sortedArray = orderService.sort(array);

      expect(arrayClone.sort).toHaveBeenCalledWith(orderService.sortAsc);
      expect(sortedArray).toBe(arrayExpected);
    });
  });

  describe('should sort caseFields', () => {
    it('should sort fields if unordered', () => {
      const CASE_FIELDS = [
        createCaseField('testField2', 'Debtor name', '', textFieldType(), null, 5),
        createCaseField('testField1', 'Debtor name', '', textFieldType(), null, 3)];

      let caseFieldsOrdered = orderService.sort(CASE_FIELDS);

      expect(caseFieldsOrdered[0].order).toEqual(3);
      expect(caseFieldsOrdered[0].id).toEqual('testField1');
      expect(caseFieldsOrdered[1].order).toEqual(5);
      expect(caseFieldsOrdered[1].id).toEqual('testField2');

    });

    it('should keep the order of the fields if already sorted', () => {
      const CASE_FIELDS = [
        createCaseField('testField1', 'Debtor name', '', textFieldType(), null, 3),
        createCaseField('testField2', 'Debtor name', '', textFieldType(), null, 5)];

      let caseFieldsOrdered = orderService.sort(CASE_FIELDS);

      expect(caseFieldsOrdered[0].order).toEqual(3);
      expect(caseFieldsOrdered[0].id).toEqual('testField1');
      expect(caseFieldsOrdered[1].order).toEqual(5);
      expect(caseFieldsOrdered[1].id).toEqual('testField2');
    });

    it('fields without order should end up on the bottom', () => {
      const CASE_FIELDS = [
        createCaseField('testField1', 'Debtor name', '', textFieldType(), null),
        createCaseField('testField2', 'Debtor name', '', textFieldType(), null, 3)];

      let caseFieldsOrdered = orderService.sort(CASE_FIELDS);

      expect(caseFieldsOrdered[0].order).toEqual(3);
      expect(caseFieldsOrdered[0].id).toEqual('testField2');
      expect(caseFieldsOrdered[1].order).toBeUndefined();
      expect(caseFieldsOrdered[1].id).toEqual('testField1');
    });

  });
});
