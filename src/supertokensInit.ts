import supertokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import ThirdParty from "supertokens-node/recipe/thirdparty";
import Session from "supertokens-node/recipe/session";

const ensureSuperTokensInit = () => {
    supertokens.init({
        framework: "express",
        supertokens: {
            connectionURI: "https://try.supertokens.com",
        },
        appInfo: {
            appName: "Sblitz",
            apiDomain: "http://localhost",
            websiteDomain: "http://localhost",
            apiBasePath: "/api/auth",
            websiteBasePath: "/auth"
        },
        recipeList: [
            EmailPassword.init(),
            ThirdParty.init({}),
            Session.init()
        ]
    });
}

export default ensureSuperTokensInit



