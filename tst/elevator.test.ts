import * as elevator from '../src/elevator'
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('Elevator going up functionality', () => {
    it('should calculate the correct travel time', () => {
      const floorsAbove = [5, 10, 20];
      const floorsVisited: number[] = [1];
  
      const travelTime = elevator.goingUp(floorsAbove, floorsVisited);
  
      expect(travelTime).toBe(190); // (5 - 1)*10 + (10 - 5)*10 + (20 - 10)*10 = 40 + 50 + 100 = 190
      expect(floorsVisited).toEqual([1, 5, 10, 20]);
    });
  
    it('should return 0 if there are no floors above', () => {
      const floorsAbove: number[] = [];
      const floorsVisited: number[] = [1];
  
      const travelTime = elevator.goingUp(floorsAbove, floorsVisited);
  
      expect(travelTime).toBe(0);
      expect(floorsVisited).toEqual([1]);
    });
  
    it('should handle descending floors in ascending order', () => {
      const floorsAbove = [4, 2, 1];
      const floorsVisited: number[] = [];
  
      elevator.goingUp(floorsAbove, floorsVisited);
  
      expect(floorsVisited).toEqual([4, 2, 1]);
    });
});

describe('Elevator going down functionality', () => {
    it('should calculate the correct travel time', () => {
      const floorsBelow = [-10, -5, 0];
      const floorsVisited: number[] = [1];
  
      const travelTime = elevator.goingDown(floorsBelow, floorsVisited);
  
      expect(travelTime).toBe(110); // (1-0)*10 + (0 - -5)*10 + (-5 - -10)*10 = 10 + 50 + 50 = 110
      expect(floorsVisited).toEqual([1, 0, -5, -10]);
    });
  
    it('should return 0 if there are no floors below', () => {
      const floorsBelow: number[] = [];
      const floorsVisited: number[] = [1];
  
      const travelTime = elevator.goingDown(floorsBelow, floorsVisited);
  
      expect(travelTime).toBe(0);
      expect(floorsVisited).toEqual([1]);
    });
  
    it('should handle descending floors in reverse order', () => {
      const floorsBelow = [4, 2, 1];
      const floorsVisited: number[] = [];
  
      elevator.goingDown(floorsBelow, floorsVisited);
  
      expect(floorsVisited).toEqual([1, 2, 4]);
    });
});

describe('isInt function', () => {
  test('should return true for integer strings', () => {
    expect(elevator.isInt('100')).toBe(true);
    expect(elevator.isInt('-50')).toBe(true);
    expect(elevator.isInt('0')).toBe(true);
  });

  test('should return true for numeric strings with spaces', () => {
    expect(elevator.isInt(' 100 ')).toBe(true);
  });

  test('should return false for floating-point strings', () => {
    expect(elevator.isInt('100.5')).toBe(false);
    expect(elevator.isInt('-50.1')).toBe(false);
  });

  test('should return false for non-numeric strings', () => {
    expect(elevator.isInt('abc')).toBe(false);
    expect(elevator.isInt('100abc')).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(elevator.isInt('')).toBe(false);
  });

  test('should return false for boolean-like strings', () => {
    expect(elevator.isInt('true')).toBe(false);
    expect(elevator.isInt('false')).toBe(false);
  });
});

describe('printRules function', () => {
  const mockReadFileSync = jest.spyOn(fs, 'readFileSync');
  const mockResolve = jest.spyOn(path, 'resolve');
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    mockReadFileSync.mockClear();
    mockResolve.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  it('prints the rules section when found', () => {
    const mockFilePath = 'README.md';
    const mockData = 'Some content before the rules\n### Rules\nRule 1: Follow the rules';
    mockReadFileSync.mockReturnValue(mockData);
    mockResolve.mockReturnValue(mockFilePath);

    elevator.printRules(mockFilePath);

    expect(mockConsoleLog).toHaveBeenCalledWith('### Rules\nRule 1: Follow the rules');
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('prints an error message when the rules section is not found', () => {
    const mockFilePath = 'README.md';
    const mockData = 'Some content without the specific heading';
    mockReadFileSync.mockReturnValue(mockData);
    mockResolve.mockReturnValue(mockFilePath);

    elevator.printRules(mockFilePath);

    expect(mockConsoleLog).toHaveBeenCalledWith("The Rules heading was not found in the README file.");
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('prints an error to the console when reading the file fails', () => {
    const mockFilePath = 'README.md';
    const mockError = new Error('Failed to read file');
    mockReadFileSync.mockImplementation(() => {
      throw mockError;
    });
    mockResolve.mockReturnValue(mockFilePath);

    elevator.printRules(mockFilePath);

    expect(mockConsoleError).toHaveBeenCalledWith('Error reading the README file:', mockError);
  });
});

