// App.js
import registerNNPushToken from "native-notify";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Auth from "./screens/Auth";
import Login from "./screens/Login";
import Register from "./screens/Register";
import RegisterAdmin from "./screens/RegisterAdmin";
import Home from "./screens/Home";
import Store from "./screens/Store";
import Shop from "./screens/Shop";
import PersonalSetting from "./components/PersonalSetting";
import Orders from "./screens/Orders";
import OrderList from "./screens/OrderList";
import Sales from "./screens/Sales";
import { ContextProvider } from "./hook/Context";

const Stack = createStackNavigator();

function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="AdminRegister" component={RegisterAdmin} />

          {/* authenticated */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Store" component={Store} />
          <Stack.Screen name="Shop" component={Shop} />
          <Stack.Screen name="Setting" component={PersonalSetting} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="OrderList" component={OrderList} />
          <Stack.Screen name="Sales" component={Sales} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}

export default App;
