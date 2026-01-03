import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpj',
  standalone: true // Importante para usar direto nos imports do componente
})
export class CpfCnpjPipe implements PipeTransform {

  transform(value: string | number | undefined | null): string {
    if (!value) return '';

    // Remove tudo que não for dígito
    const valueStr = value.toString().replace(/\D/g, '');

    // Máscara de CPF (000.000.000-00)
    if (valueStr.length === 11) {
      return valueStr.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Máscara de CNPJ (00.000.000/0001-00)
    else if (valueStr.length === 14) {
      return valueStr.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Se não for nem 11 nem 14, retorna o valor original (ou vazio)
    return value.toString();
  }
}
