import { Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, filter, map, of, switchMap, throwError } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})

export class ListaLivrosComponent  {

  campoBusca = new FormControl();
  mensagemErro = ''
  livrosResultado: import("c:/Users/fulvi/Downloads/2685-angular-rxjs-projeto-base/2685-angular-rxjs-projeto-base/src/app/models/interfaces").LivrosResultado;


  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length>=3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.error(erro)
      return of()
    }
    )
  )

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length>=3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      // this.mensagemErro = 'Ops, ocorreu um erro. recarregue a aplicação'
      // return EMPTY
      console.error(erro)
      return throwError(() => new Error(this.mensagemErro = 'Ops, ocorreu um erro. recarregue a aplicação'))
    })
  )

    livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
      return items.map(item => {
        return new LivroVolumeInfo(item)
      })
    }

}





