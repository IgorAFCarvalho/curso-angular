import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Alerta } from './../../shared/models/alerta';
import { Filme } from './../../shared/models/filme';
import { FilmesService } from './../../core/filmes.service';
import { ValidarCamposService } from './../../shared/components/campos/validar-campos.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  id: number;
  cadastro: FormGroup;
  generos: Array<string>;

  constructor(
    public validacao: ValidarCamposService,
    public dialog: MatDialog,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder,
    private filmesService: FilmesService,
    private router: Router,
  ) { }

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params['id'];
    if (this.id) {
      this.filmesService.visualizar(this.id).subscribe((filme: Filme) => this.criarFormulario(filme));
    } else {
      this.criarFormulario(this.criarFilmeBranco());
    }
    this.generos = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Cientfica',  'Romance', 'Terror'];
  }
  submit(): void {
      this.cadastro.markAllAsTouched();
      if (this.cadastro.invalid) {
        return;
      }

      const filme = this.cadastro.getRawValue() as Filme;
      if (this.id) {
        filme.id = this.id;
        this.editar(filme);
      } else {
        this.salvar(filme);
      }
  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required , Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDB: [filme.urlIMDB, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private criarFilmeBranco(): Filme {
    return{
      id: null,
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      descricao: null,
      nota: null,
      genero: null,
      urlIMDB: null,
    };
  }

  private salvar(filme: Filme): void {
    this.filmesService.salvar(filme).subscribe(
      () => {
        const config = {
          data: {
            btnSucesso: 'Ir para a listagem',
            btnCancelar: 'Cadastrar um novo filme',
            corBtnCancelar: 'primary',
            possuiBtnFechar: true
          } as Alerta
        };
        const dialogRef = this.dialog.open(AlertaComponent, config) ;
        dialogRef.afterClosed().subscribe((opcao: boolean) => {
          if (opcao) {
            this.router.navigateByUrl('filmes');
          } else {
            this.reiniciarForm();
          }

        });
      },
      () => {
        const config = {
          data: {
            titulo: 'Erro ao salvar o registro',
            descricao: 'Não conseguirmos salvar seu registro, por favor tentar novamente mais tarde',
            corBtnSucesso: 'warn',
            btnSucesso: 'Fechar',
          } as Alerta
        };
        this.dialog.open(AlertaComponent, config);
      },
    );
  }

  private editar(filme: Filme): void {
    this.filmesService.editar(filme).subscribe(
      () => {
        const config = {
          data: {
            descricao: 'Seu registro foi atualizado com sucesso!',
            btnSucesso: 'Ir para a listagem',
          } as Alerta
        };
        const dialogRef = this.dialog.open(AlertaComponent, config) ;
        dialogRef.afterClosed().subscribe(() => {
            this.router.navigateByUrl('filmes');
        });
      },
      () => {
        const config = {
          data: {
            titulo: 'Erro ao editar o registro',
            descricao: 'Não conseguirmos editar seu registro, por favor tentar novamente mais tarde',
            corBtnSucesso: 'warn',
            btnSucesso: 'Fechar',
          } as Alerta
        };
        this.dialog.open(AlertaComponent, config);
      },
    );
  }



}
