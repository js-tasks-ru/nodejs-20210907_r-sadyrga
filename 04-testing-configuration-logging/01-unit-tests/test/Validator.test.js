const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('Валидатор проверяет строковое поле name', () => {
      const stringNameFieldValidator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      it('значение в пределах допустимого', () => {
        const errors = stringNameFieldValidator.validate({name: 'Lalala Lalala'});
        expect(errors).to.have.length(0);
      });

      it('значение ниже допустимого', () => {
        const errors = stringNameFieldValidator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0])
            .to.have.property('field')
            .and.to.be.equal('name');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal('too short, expect 10, got 6');
      });

      it('значение больше допустимого', () => {
        const errors = stringNameFieldValidator.validate({
          name: 'Lalala Lalala Lalala Lalala Lalala',
        });

        expect(errors).to.have.length(1);
        expect(errors[0])
            .to.have.property('field')
            .and.to.be.equal('name');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal('too long, expect 20, got 34');
      });

      it('значение недопустимого типа', () => {
        const errors = stringNameFieldValidator.validate({name: 12345});

        expect(errors).to.have.length(1);
        expect(errors[0])
            .to.have.property('field')
            .and.to.be.equal('name');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal('expect string, got number');
      });
    });


    describe('Валидатор проверяет числовое поле age', () => {
      const numberAgeFieldValidator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      it('значение в пределах допустимого', () => {
        const errors = numberAgeFieldValidator.validate({age: 21});
        expect(errors).to.have.length(0);
      });

      it('значение ниже допустимого', () => {
        const errors = numberAgeFieldValidator.validate({age: 14});

        expect(errors).to.have.length(1);
        expect(errors[0])
            .to.have.property('field')
            .and.to.be.equal('age');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal('too little, expect 18, got 14');
      });

      it('значение больше допустимого', () => {
        const errors = numberAgeFieldValidator.validate({age: 80});

        expect(errors).to.have.length(1);
        expect(errors[0])
            .to.have.property('field')
            .and.to.be.equal('age');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal('too big, expect 27, got 80');
      });

      it('значение недопустимого типа', () => {
        const errors = numberAgeFieldValidator.validate({age: '80'});

        expect(errors).to.have.length(1);
        expect(errors[0])
            .to.have.property('field')
            .and.to.be.equal('age');
        expect(errors[0])
            .to.have.property('error')
            .and.to.be.equal('expect number, got string');
      });
    });
  });
});
