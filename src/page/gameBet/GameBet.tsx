import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActcion } from "../../store/cart";

import { Button, ButtonsAct, Header, ButtonNumber } from "../../components/";

import { TypesCenter, TypesContent } from "./styles";
import { numberActions } from "../../store/gameNumber";
import Cart from "../../components/cart/cart";
import { betActions } from "../../store/gameBet";
import { IContent, IGame, IPropsData, IPropsState } from "./interfaces";

const GameBet: React.FC<IPropsData> = (props) => {
  const [type, setType] = useState<string | null>("Lotofácil");
  const [description, setDescription] = useState<String>("");
  const [range, setRange] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [maxNumber, setMaxNumber] = useState<number>(0);
  const [color, setColor] = useState<string>("");
  const [count, setCount] = useState<number>(1);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: IPropsState) => state.cart.items);
  const game = useSelector((state: IGame) => state.number.numberArr);

  let date = new Date();
  const data = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();

  useEffect(() => {
    props.data.map((content: any) => {
      if (content.type === type) {
        return ContentTypesHandler(content);
      }
      return null;
    });
  }, [props.data, ContentTypesHandler, type]);

  function ContentTypesHandler(props: IContent): void {
    setType(props.type);
    setDescription(props.description);
    setRange(props.range);
    setPrice(props.price);
    setMaxNumber(props["max-number"]);
    setColor(props.color);
  }

  function cleanGame(): void {
    dispatch(numberActions.handlerRemoveArrNumbers());
    setCount(1);
    setRange(0);
  }

  function onHandlerClick(props: string | null): void {
    cleanGame();
    setType(props);
  }

  const addToCartHandler = (): void => {
    if (game.length < maxNumber) {
      alert(
        `Faltam ${maxNumber - game.length} números para concluir o seu jogo!`
      );
      dispatch(betActions.removeToggle());
      return;
    }
    dispatch(
      cartActcion.addItemToCart({
        game,
        data,
        price,
        type,
        date,
        color,
      })
    );
    onHandlerClick(type);
  };

  const countHandler = (props: string): void => {
    if (props === "REMOVE") {
      setCount(count - 1);
    } else if (props === "ADD") {
      setCount(count + 1);
    }
  };

  return (
    <Fragment>
      <Header />
      <TypesContent>
        <TypesCenter>
          <h2>New bet for {type}</h2>
          <p>Choose a game</p>

          <Button name={type} onContent={onHandlerClick} data={props.data} />

          <p>
            Fill your bet
            <span>{description}</span>
          </p>

          <ButtonNumber
            number={range}
            maxRange={maxNumber}
            count={count}
            color={color}
            onHandlerCount={countHandler}
          />

          <ButtonsAct onClean={cleanGame} onAdd={addToCartHandler} />
        </TypesCenter>
        <Cart cartItems={cartItems} />
      </TypesContent>
    </Fragment>
  );
};

export default GameBet;