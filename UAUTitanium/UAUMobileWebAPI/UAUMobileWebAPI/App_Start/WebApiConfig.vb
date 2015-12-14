Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports System.Web.Http
Imports System.Net.Http.Headers

Public Module WebApiConfig

    Public Sub Register(ByVal config As HttpConfiguration)
        ' Web API configuration and services

        ' Web API routes
        config.MapHttpAttributeRoutes()

        config.Formatters.JsonFormatter.SupportedMediaTypes.Add(New MediaTypeHeaderValue("text/html"))

        config.Routes.MapHttpRoute(
            name:="DefaultApi",
            routeTemplate:="api/{controller}/{action}/{id}",
            defaults:=New With {.id = RouteParameter.Optional}
        )

        'Faço login root no ACS Corporativo.
        AdminACS.realizaLoginCorporativo()
        'Faço login root no ACS Cliente.
        AdminACS.realizaLoginCliente()

    End Sub

End Module
