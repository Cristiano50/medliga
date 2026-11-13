// Cartões da tela inicial e das disciplinas: emblema (ícone numa placa na cor do assunto), cartão de jogo,
// cartão de disciplina e cartão das disciplinas que ainda vêm.
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icone } from './Icone.tsx';
import type { NomeIcone } from './icones.ts';

const corDe = (cor: string) => ({ '--cor': cor }) as CSSProperties;

/** Ícone numa placa arredondada, tingida com a cor do assunto. Decorativo: o nome vem escrito ao lado. */
export function Emblema({ icone, cor, tamanho = 48 }: { icone: NomeIcone; cor: string; tamanho?: number }) {
  return (
    <span className="emblema" style={{ ...corDe(cor), width: tamanho, height: tamanho, borderRadius: Math.round(tamanho * 0.3) }}>
      <Icone nome={icone} tamanho={Math.round(tamanho * 0.58)} />
    </span>
  );
}

export interface CartaoJogoProps {
  to: string;
  icone: NomeIcone;
  cor: string;
  nome: string;
  descricao: string;
  /** cartão principal da seção: emblema maior e fundo tingido */
  destaque?: boolean;
  /** selos e avisos curtos, abaixo da descrição */
  children?: ReactNode;
}

/** Cartão de um jogo ou de uma disciplina aberta: emblema à esquerda, nome e descrição, e a seta de quem leva a outra tela. */
export function CartaoJogo({ to, icone, cor, nome, descricao, destaque = false, children }: CartaoJogoProps) {
  return (
    <Link to={to} className={`card cartao-jogo ${destaque ? 'destaque' : ''}`.trim()} style={corDe(cor)}>
      <Emblema icone={icone} cor={cor} tamanho={destaque ? 56 : 48} />
      <span className="texto">
        <strong>{nome}</strong>
        <span className="muted pequeno">{descricao}</span>
        {children}
      </span>
      <Icone nome="seta-direita" tamanho={18} className="seta" />
    </Link>
  );
}

/** Disciplina que ainda vai chegar: cartão menor, sem ação. */
export function CartaoEmBreve({ icone, cor, nome, descricao }: { icone: NomeIcone; cor: string; nome: string; descricao: string }) {
  return (
    <div className="cartao-breve" style={corDe(cor)}>
      <Emblema icone={icone} cor={cor} tamanho={40} />
      <span className="texto">
        <strong>{nome}</strong>
        <span className="muted">{descricao}</span>
        <span className="so-leitor">Em breve</span>
      </span>
    </div>
  );
}
