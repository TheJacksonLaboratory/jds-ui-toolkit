# JdsUiComponents

<a alt="The Jackson Laboratory Logo" href="https://www.jax.org" target="_blank" rel="noreferrer">
    <img src="public/JAX-logo-helix-only-blue.png" width="45">
</a> 

## *Overview*

The *JAX Data Science UI Components* repository is a development workspace that streamlines the creation, testing and 
deployment of **shareable** UI components across the *JAX Data Science* community. The workspace utilizes development 
practices and tools that promote code reuse, reduce duplication, and ensure architectural consistency 
across the *JAX Data Science* community.

The workspace uses the Nx build system and has a [monorepo structure](https://angular.dev/reference/configs/file-structure#multiple-projects). 
There are two libraries - *@jax-data-science/ui-components* and *@jax-data-science/api-clients* - and one root application.

The workspace is maintained by the JAX Data Science UI/UX team and undergoes continuous updates to keep up with the 
latest technologies. This commitment to technological currency ensures that all shared UI components benefit from the latest performance 
improvements, security patches, and feature enhancements while also keeping backward compatibility.

## *Local Setup*
- Clone the workspace from the [GitHub](https://github.com/TheJacksonLaboratory/jds-ui-components) repository


- Install the dependencies using [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm)
```bash
npm install
```
- Start the development server locally
```bash
npm run start
```

- Open your browser and navigate to [http://localhost:4200](http://localhost:4200) to view the application. 
You should see the showcase application with the list of available components. 

## *Creating Shared Components*

The workspace provides two libraries - _@jax-data-science/ui-components_ and _@jax-data-science/api-clients_ - and 
one (root) showcase application, which is used to test and demonstrate the UI components. 

Do <u>**not**</u> add any new libraries to the monorepo workspace!!

To start implementing your shared components, create a new module/directory in the **ui-components** or **clients-api** 
libraries (like */ui-components/my-new-component* or */api-clients/my-new-component*).

You can use the below Nx command: 
```bash
# ui-components
npx nx g @nrwl/angular:component --path=ui-components/lib/my-new-component --export=true 

# clients-api
npx nx g @nrwl/angular:component --path=api-clients/lib/my-new-component --export=true 
```
The command will create a new module/directory in the **ui-components** library/directory. You can also use the 
`--dry-run` flag with the above command first to see what files will be created without actually creating them.


## *Testing / QA*
Once you have implemented your component, it will need to be tested. Testing is done using the showcase application, 
which is located in the */src* directory. 

- create */src/pages/my-new-component* and update the */src/app/app-routing.module.ts* file to include the new component


- update the table in */src/app/pages/components-list/components-list.component.html* to include and link to your new component


- next, create a pull request (PR) to the **main** branch of the repository


- once the PR is approved, you will need to deploy the branch to the GCP instance, 
where the QA team will be able to test the component using the showcase application

<a alt="The Jackson Laboratory Logo" href="https://www.jax.org" target="_blank" rel="noreferrer">
    <img src="public/release-process-jax-data-science-ui-components.png" width="100%">
</a> 

## *Releasing*
Once the component has been tested and approved by the QA team, you can proceed with releasing the component. 
You will need to: 
- update the version of the component in the **package.json** - each */ui-components* 
and */api-clients* directory has its own **package.json** file.


- update the **CHANGELOG.md** file - each */ui-components* and */api-clients* directory has its own **CHANGELOG.md** file.


- commit and push the updated to the GitHub repository


- do <u>not</u> run the NPM RELEASE pipeline!! The UX/UI team will publish the package.  
