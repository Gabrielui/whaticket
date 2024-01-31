import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#fafafa",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "55px 30px",
    borderRadius: "12.5px",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  whatsappButton: {
    background: "#00826a",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    "&:hover": {
      background: "#0c6a58",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  logo: {
    margin: "10px auto",
    width: "90%",
    display: "block",
    transform: "scale(0.7)", // Reduz o tamanho em 30%
  },
}));

const Login = () => {
  const classes = useStyles();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simula a verificação de domínio (substitua isso pela sua lógica real)
    const isDomainAllowed = true; // Substitua pela lógica de verificação de domínio
    
    if (!isDomainAllowed) {
      setTimeout(() => {
        setShowErrorMessage(true);
      }, 60000); // Espera 1 minuto antes de mostrar a mensagem de erro
    } else {
      handleLogin(user);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div>
          <img
            style={{
              margin: "0 auto",
              height: "100%",
              width: "100%",
              alignSelf: "center",
            }}
            src={logo}
            alt="Whats"
          />
        </div>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChangeInput}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            value={user.password}
            onChange={handleChangeInput}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
          {showErrorMessage && (
            <Typography variant="body2" color="error">
              Domínio não permitido
            </Typography>
          )}
          <Grid container>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                component={RouterLink}
                to="/forgetpsw"
              >
                Esqueci minha senha
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                component={RouterLink}
                to="/signup"
              >
                Não tem uma conta? Cadastre-se!
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

      <a
        href={`https://wa.me/${process.env.REACT_APP_NUMBER_SUPPORT}`}
        className={classes.whatsappButton}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon /> Entrar em Contato pelo WhatsApp
      </a>
    </Container>
  );
};

export default Login;
