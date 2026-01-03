import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const appTitleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  // 1. Pega o ID da URL (ex: 'new' ou '123')
  const id = route.paramMap.get('id');

  // 2. Pega o nome da entidade que passaremos na rota (ex: 'Pessoa', 'Produto')
  // Se não tiver nada definido, usa 'Item' como fallback
  const entityName = route.data['entityName'] || 'Item';

  // 3. Define a ação
  const action = id === 'new' ? 'Cadastro de' : 'Alteração de';

  // 4. Retorna a string montada (ex: "Cadastro de Pessoa")
  return `${action} ${entityName}`;
};
