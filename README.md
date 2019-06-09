# Redux-helper
Ce tuto n'est pas destiné à créer un projet ensemble. Il ne vise qu'à rappeler comment nous allons faire un usage basique de redux au sein d'un projet React.
## IMPORTANT
Les commandes de terminal supposent que nous sommes positionnés à l'origine de notre projet
## Commençons par ajouter Redux via notre terminal : 
```terminal
npm install --save redux react-redux
```
Nous installons Redux mais aussi React-Redux de manière à permettre aux 2 technos de communiquer. Je vous précise que Redux peut fonctionner tout seul mais notre but ici est de le faire cohabiter avec React. Pour info, --save permet d'ajouter automatiquement les packages désirés dans le fichier package.json de votre projet.
## Passons à notre projet
Redux va nous faire manipuler 2 nouveaux types de fichers, les actions et les reducers. Créons les dès maintenant:
```terminal
cd src
mkdir actions
cd actions
touch index.js
cd ../
mkdir reducers
cd reducers
touch authReducer.js
touch index.js
cd ../../
```
- Pour ceux dont leur terminal accepte de chainer les actions avec &&, faites vous plaisir.
## Actions
Commençons par l'action, ouvrez le fichier contenu dans src/actions/index.js fraichement créé. Prenons pour exemple la gestion de connexion:
```javascript
export const signIn = () => {
  return {
    type: 'SIGN_IN'
  };
};
```
Explication: ici, la fonction signIn() retourne un objet. Celui-ci se compose d'une clé type avec pour valeur 'SIGN_IN' et très fréquemment d'une clé payload dont la valeur peut être dynamique grâce à un éventuel paramètre passé dans la fonction. Notons également l'utilisation d'un export nommé qui devra être pris en compte lors de l'import dans un autre fichier. Nous y reviendrons.

- Pour info, il est préférable de stocker les types des actions dans des constantes ce qui donne finalement:
```javascript
export const SIGN_IN = 'SIGN_IN';

export const signIn = () => {
  return {
    type: SIGN_IN
  };
};
```
Sans s'étendre sur le sujet, cela vous permet de bénéficier de l'auto-complétion de votre éditeur de texte et vous évite les typos.

Bien! notre action est créée! A ce stade, elle n'est encore déclenchée nulle part et elle ne sait pas non plus quoi faire. Son unique but dans la vie sera d'être appelée dans un de vos composants pour finalement être envoyée vers vos reducers. Cela tombe bien, nous allons nous intéresser à ces derniers.

## Reducers
Les reducers tirent leur nom d'un méthode Javascript nommée reduce() et qui à pour but de traiter chaque valeur d'une liste afin de la réduire à une seule valeur ([source MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/reduce)).Ouvrons notre fichier reducer situé dans src/reducers/authReducer.js et insérons les lignes suivantes:
```javascript
import { SIGN_IN } from "../actions";

const INITIAL_STATE = {
  isSignedIn: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true };
    default:
      return state;
  }
};
```
Plein de chose à comprendre ici. Pour commencer, vous vous rappelez de l'export nommé que nous avons utilisé dans l'action? Et bien nous l'importons ici mais en l'entourant d'accolades, cela permet de cibler et d'éxécuter une fonction bien précise dans le fichier ciblé.

Ensuite nous devons attribuer un état initial à notre state afin d'éviter impérativement la valeur 'undefined', grande ennemie de vos reducers.Il est à noter que lors de la déclaration d'une fonction qui attend un paramètre, nous pouvons lui en attribuer un par défaut comme dans l'exemple suivant: 
```javascript
const rechercheJob = (ville = 'paris') => {
  //du code
}
```
- ce code retournera par défaut paris mais affichera une autre ville pour peu que celle-ci soit fournie en paramètre à la fonction

Cela va plus vite bien sûr mais dans notre cas, nous passons un objet contenant une paire clé/valeur, par soucis de lisibité nous optons donc pour la déclaration de notre état initial dans une variable.

Vient ensuite la création du reducer (qui est une banale fonction) qui prend en paramètre l'état initial évoqué ci-dessus et une action. A l'intérieur de cette fonction, nous pouvons déterminer la modification à entreprendre en fonction du type de l'action reçue. Nous allons donc avoir recours aux conditions et en particulier au switch. Personne ne vous empêche d'utiliser des if/else mais vous irez à l'encontre d'une convention déjà établie. 

Le switch va donc vérifier le action.type et - en cas de correspondance - retourner le code désiré.

Notre exemple mérite une petite analyse: 

1) nous retournons un objet dans lequel nous faisons appel à l'opérateur de décomposition qui créé une copie de l'objet state actuel (...state). Si le state est 'undefined' au moment de l'appel de la fonction, c'est donc INITIAL_STATE qui sera choisi par défaut

2) dans le nouveau tableau créé par ...state, nous ajoutons une paire clé/valeur qui remplacera donc celle présente dans le précédent state.

3) vous notez que pour la clé isSignedIn, nous attribuons la valeur true.

4) en l'absence d'autre valeur à vérifier, nous terminons notre switch avec une valeur default qui retournera le state actuel (et donc inchangé)

OK! voilà une bonne chose de faite! Pensons à compléter notre action en implémentant la méthode signOut().
```javascript
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

export const signIn = () => {
  return {
    type: SIGN_IN
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT
  };
};
```
Et maintenant complétons notre reducer:
```javascript
import { SIGN_IN, SIGN_OUT } from "../actions";

const INITIAL_STATE = {
  isSignedIn: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true };
    case SIGN_OUT:
      return { ...state, isSignedIn: false};
    default:
      return state;
  }
};
```
Vous avez remarqué? Si notre action.type équivaut à SIGN_OUT, nous appliquons le même schéma qu'évoqué plus haut. Nous récupérons une copie du state, isSignedIn devient false. Ainsi nous sommes de retour à l'état initial.

- Redux veut s'assurer que vous ne muterez pas le state stocké dans votre store, c'est la raison pour laquelle nous avons recours à {...state}. Cela permet de ne jamais modifier le state actuel, puisque en réalité nous retournons une copie de celui-ci et nous mettons à jour nos propriétés.


## Réunir les reducers dans un seul et même objet
Dans le cas de notre exemple, nous n'avons qu'un seul reducer mais rassurez-vous (ou pas), vous aurez probablement besoin de plus!

Nous allons donc devoir les combiner pour ne former qu'un seul objet. Ouvrons src/reducers/index.js afin d'y insérer le code suivant:
```javascript
import { combineReducers } from "redux";
import authReducer from "./authReducer";

export default combineReducers({
  auth: authReducer
});
```
Et voilà! { combineReducers } nous est fourni grace au package redux tandis qu'authReducer est notre fichier fraîchement codé. Il ne nous reste plus qu'à exporter le tout en faisant appel à combineReducers qui prend en paramètre un objet. Choisissez un nom cohérent pour la clé car c'est par cette propriété que vous accéderez ensuite à vos données quand vous connecterez Redux à vos composants. La valeur quant à elle n'est autre qu'un reducer, en l'occurrence le authReducer.

## Création du store
Ouvrons à présent notre fichier src/index.js (créé par vos soins ou généré par create-react-app et donc à priori composé d'un import de react, react-dom et probablement de votre App.js) et regardons ce qui suit:
```javascript
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from './reducers
```
En plus de notre fichier src/reducers/index.js (index.js est implicite et n'apparait donc pas dans l'import), nous appelons 2 fonctions fournies par redux et react-redux et qui vont être utilisées comme suit: 
```javascript
const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
```
Nous faisons appel à la fonction createStore et nous l'approvisions avec nos reducers (qui définiront donc notre state utilisable sur toute notre app) et nous stockons tout cela dans une constante appelée intelligement store. Puis nous modifions quelque peu notre ReactDOM.render en entourant notre App d'un autre composant, le Provider auquel nous passons un props, à savoir notre store. Cela signifie qu'à partir de maintenant, notre App sera enfant de Provider et pourra donc compter sur ce composant parent pour être alimenté en données.
- J'ai commencé ce tuto en abordant les actions mais toujours aucune info de la manière dont elle se déclenche! Nous allons aborder ce sujet dans la partie suivante ;)
## Connecter le store à un composant
Nous avons vu ensemble la création d'une action de connexion/déconnexion et l'avons relié à notre reducer. Cette action doit maintenant être utilisable dans un composant! Considérons que le fichier src/components/App.js existe et regardons son code actuel:
```javascript
import React from "react";

class App extends React.Component {

  signOutClick = () => {};

  signInClick = () => {};
  
  render() {
    return (
      <div>
        <button onClick={this.signInClick}>Sign in</button>
        <button onClick={this.signOutClick}>Sign out</button>
      </div>
    )
  }
}

export default App;
```
Bien, nous affichons à l'écran 2 boutons intitulés Sign in et Sign out, tous 2 liés à des méthodes créées mais non fonctionnelles. Vous avez surement déjà anticipé que nous n'allons pas codé ces fonctions ici puisque nous avons déjà préparé le terrain depuis le début de ce tuto.

Commençons par importer la fonction connect de redux et servons en nous pour connecter notre store à notre composant:
```javascript
import { connect } from "react-redux";

{
  /*tout notre code précédent ici*/
}

export default connect()(App);
```
Que se passe t-il jusqu'à présent? Tout en haut de notre document, nous avons ajouté un import nous permettant ainsi d'exporter notre composant mais cette fois-ci il sera connecté grace à la fonction connect(). Ensuite:
```javascript
import { signIn, signOut } from "../actions";

{
  /*tout notre code précédent ici*/
}

const mapStateToProps = state => { return { isSignedIn: state.auth.isSignedIn}}

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(App);
```
Wow, qu'avons-nous là? En tout premier lieu, nous demandons à notre composant d'importer les actions créées au début de ce tuto. Nous constatons ensuite que nous avons défini une const nommée mapStateToProps qui prend en paramètre le state actuel stocké dans notre store. De cette fonction, nous décidons de créer une clé isSignedIn (à laquelle nous aurons accès dans notre composant). Sa valeur, un booléen, sera équivalente à celle actuellement stockée dans state.auth.isSignedIn (actuellement false).

- Pour éclaircir ce point, je vous rappelle que nous avons bel et bien créé un reducer nommé authReducer.js et que celui-ci détient effectivement une propriété isSignedIn. Ce reducer a été ajouté à notre combineReducer sous la propriété auth. Puisque nous l'avons ensuite rattaché à notre store et que ce même store approvisionne notre composant App (via le Provider ajouté dans notre index.js situé à la racine du projet), le state global est donc accessible via la fonction connect et son accès se fait bien en consultant le state, puis sa propriété auth, et pour finir sa propriété isSignedIn, soit state.auth.isSignedIn et c'est cette valeur que nous souhaitons retourner plus haut dans notre fonction afin de l'utiliser dans le composant.

Revenons à notre fonction connect() qui a quelque peu changé. Je ne vous l'avais pas précisé auparavant mais celle ci prend 2 arguments en compte, le mapStateToProps et le mapDispatchToProps. Nous avons créé la constante mapStateToProps et devons la passer en premier paramètre, ce qui est déjà fait. Le second argument, mapDispatchToProps, a été intégré à même la fonction connect (sans passer par une variable) et va faire appel aux actions importées en haut du document. Au sein de ce composant, nous bénéficions maintenant des actions et des reducers, qui vont nous permettre de déclencher des mises à jour de notre state. En effet, lors des clics sur nos boutons, une action sera déclenchée, les reducers vont les traiter afin de mettre à jour notre state, et ce même state sera accessible via le connect que nous avons implémenté. La boucle est bouclée, nous allons très vite pouvoir envoyer des infos dans notre store et ensuite les récupérer dans notre composant. Que nous reste t-il à faire? Voyons celà des maintenant.

- Petite info, vous vous attendiez peut-être à lire { signIn : signIn, signOut: sign:Out } au lieu { signIn, signOut }. En effet, un objet s'écrit toujours en suivant la notation clé/valeur mais vous pouvez raccourcir cette notation si la clé et la valeur portent chacune le même nom.
```javascript
{/*du code...*/}

signOutClick = () => {
    this.props.signOut();
  };

  signInClick = () => {
    this.props.signIn();
  };
  
{/*du code...*/}
```
Et voilà. Nos 2 fonctions importées puis connectées sont maintenant utilisables ici en tant que props. Ce qui veut dire qu'au click sur un des boutons, cette fonction sera appelée, déclenchera notre action, sera traitée par le reducer et alimentera notre store. Notre propriété isSignedIn va donc pouvoir être modifiée depuis ce composant en fonction du bouton sur lequel je clique. Puisque nous avons accès au booléen stocké dans isSignedIn, il est temps de mettre en place un affichage conditionnel de notre composant dans sa méthode render():
```javascript
 render() {
    return (
      <div>
        {!this.props.isSignedIn && (
          <button onClick={this.signInClick}>Sign in</button>
        )}
        {this.props.isSignedIn && (
          <button onClick={this.signOutClick}>Sign out</button>
        )}
      </div>
    );
  }
}
```
Et ça fonctionne, le bouton change en fonction du props isSignedIn, qui est stocké dans notre store, accessible via la propriété state connectée à notre composant.
- Vous constatez une syntaxe étrange pour ma condition? C'est du built-in React et je vous encourage donc à lire [ceci](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator).

Wow, est-ce qu'on a fini? Je crois bien que oui! C'est du redux de bas niveau mais le but est de comprendre le fonctionnement et de savoir l'implémenter! 

- Si vous constatez quelque chose de faux, de peu clair ou de non-fonctionnel, envoyez moi une pull request que je lirai avec attention !
