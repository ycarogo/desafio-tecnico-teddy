import { render, screen } from "@testing-library/react";
import { describe, test } from "vitest";
import { Button } from "./button";

describe("Teset do Button ", () => {
  test("Deve renderizar corretament ", () => {
    render(<Button>Entrar</Button>);
    screen.getByText("Entrar");
  });
});
